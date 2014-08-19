'use strict';

(function (id, exports) {
    //一些常量配置
    var CONSTANTS = {
        //不同百分比节点的半径配置
        radius: [40, 40, 40, 40, 40, 40, 50, 60, 70, 80, 80],
        //文案字体大小
        fontSize: 20,
        //圆环起始角度（从12点位置即 - Math.PI * 0.5 开始逆时针）
        beginAngle: - Math.PI * 0.5,
        //画一个圆环需要的角度（逆时针的360度即 - Math.PI * 2）
        wholeAngle: - Math.PI * 2,
        //圆环宽度
        ringWidth: 10,
        //颜色配置
        colors: {
            bottom: '#70aee7',//圆圈底色
            ring: ['#b8e5c4', '#c0edac', '#cababb', '#9ffaaa'],//圆环颜色
            inside: '#7eb7ec',//中间文案背景色
            text: '#fff',//文案颜色,
            rootText: '#3e84c2',
            rootInside: '#e4e6e5',
            rootBottom: '#e4e4e4',
            line: '#b1d1f7'//线条颜色
        },
        backgroundImg: BACKGROUND_URL,
        zhWidth: 15,//汉字宽度
        enWidth: 9,//英文宽度
        minRadius: 40,//圆圈最小半径
        maxRadius: 100//圆圈最大半径,
    };

    //获取字节长度（汉子长度为2）
    var getBytesLenght = function (str) {
        var len = str.length;
        var bytes = len;
        for (var i = 0; i < len; i++) {
            if (str.charCodeAt(i) > 255) {
                bytes++;
            }
        }
        return bytes;
    };
    //计算文字宽度
    var calTextWidth = function (text) {
        //根据文字数量计算圆圈半径
        var bytes = getBytesLenght(text);
        var len = text.length;
        var zhCharLenght = bytes - len;//汉字个数
        var enCharLenght = len - zhCharLenght;//英文个数
        return zhCharLenght * CONSTANTS.zhWidth + enCharLenght * CONSTANTS.enWidth;
    };
    //循环产生1/2/3/4象限值(假随机，为了使节点尽量分散在各象限)
    /*var getQuadrant = (function () {
        var i = -1;
        return function () {
            ++i;
            return (i % 4) + 1;
        };
    }());*/

    //画布DOM元素
    var canvas = document.getElementById(id);
    //画布上下文
    var context = canvas.getContext('2d');
    //画布长宽
    var canvasWidth = exports.canvasWidth = canvas.scrollWidth;
    var canvasHeight =  exports.canvasHeight = canvas.scrollHeight;
    //画布中心节点点位置及半径
    var center = {
        x: Math.floor(canvasWidth / 2),
        y: Math.floor(canvasHeight / 2)
    };

    //中心节点缓存
    var centerNode;
    //根节点（白色）缓存
    var rootNode;
    //根节点配置（key为节点id(string), value为节点的父节点）
    var rootMap = {};

    //圆圈缓存,每个节点存放x/y/radius三项数据
    var circleCache = exports.circleCache = [];

    //清空画布所有内容并重新绘制背景图（以便重新绘制）
    var fadeOutCanvas = function (callback) {
        var fade;
        var origin = 1;
        var current = origin;
        var duration = 200;
        var per = origin / duration;
        var restart = function () {
            clearInterval(fade);
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            canvas.style.opacity = '';

            //清空圆的缓存
            circleCache = [];

            //清空节点缓存
            nodeCache = [];

            //关闭鼠标悬浮事件
            mouseEvents.off();

            //绘制背景图
            drawBackground(callback);
        };
        fade = setInterval(function () {
            current -= per * 50;
            canvas.style.opacity = current;
            (current <= 0) && restart();
        }, 50);
    };

    //绘制背景图
    var drawBackground = function (callback) {
        var img = new Image();
        img.onload = function () {
            context.drawImage(img, 0, 0);
            typeof callback === 'function' && callback();
        };
        img.src = CONSTANTS.backgroundImg;
    };

    //绘制一个整圆
    var drawWholeCircel = function (x, y, color, radius) {
        context.beginPath();
        context.moveTo(x, y);
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    };
    //绘制文字
    var drawText = function (x, y, text, fontSize, color) {
        fontSize = fontSize || CONSTANTS.fontSize;
        context.font = 'normal ' + fontSize + 'px Arial, \'Microsoft Yahei\'';
        context.fillStyle = color || CONSTANTS.colors.text;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.moveTo(x, y);
        context.fillText(text, x, y);
    };
    //绘制百分比进度
    var drawProcessAnimation = function (x, y, process, radius, afterEachFrame) {
        //从上方开始逆时针绘制百分比
        //开始角度CONSTANTS.beginAngle
        //终点角度CONSTANTS.wholeAngle * process / 100 + CONSTANTS.beginAngle
        (function () {
            var p = process;
            var per = p / 20;
            var i = 0;
            var from = CONSTANTS.beginAngle, to;
            function drawIt() {
                var cur;
                i++;
                cur = i * per;
                if (cur <= p) {
                    setTimeout(function () {
                        to = CONSTANTS.wholeAngle * cur / 100 + CONSTANTS.beginAngle;
                        context.beginPath();
                        context.moveTo(x, y);
                        context.arc(x, y, radius, from, to, true);
                        context.closePath();
                        context.fillStyle = CONSTANTS.colors.ring[0];//TODO
                        context.fill();
                        typeof afterEachFrame === 'function' && afterEachFrame();
                        if (p === 0) {
                            return;
                        }
                        from = to - CONSTANTS.wholeAngle / 180;//TODO
                        drawIt();
                    }, 20);
                }
            }
            drawIt();
        }());
    };
    //绘制节点
    var drawNode = function (circle, process, name) {
        var x = circle.x;
        var y = circle.y;
        var radius = circle.radius;
        //底圆
        drawWholeCircel(x, y, CONSTANTS.colors.bottom, radius);
        //圆环
        context.beginPath();
        context.moveTo(x, y);
        //绘制百分比
        drawProcessAnimation(x, y, process, radius, function () {
            //中间区域
            drawWholeCircel(x, y, CONSTANTS.colors.inside, radius - CONSTANTS.ringWidth);
            //文字
            process > 0 && drawText(x, y - CONSTANTS.fontSize / 2 - 5, name);//第一行(中间网上移动)
            process <= 0 && drawText(x, y, name);//第一行(无百分比，显示在正中间)
            process > 0 && drawText(x, y + CONSTANTS.fontSize / 2 + 5, process + '%');//第二行(中间网下移动)
        });

        return circle;
    };
    //绘制根节点（白色节点）
    var drawRootNode = function () {
        //var wd = calTextWidth(rootNode.name) + 10;
        var x = rootNode.circle.x;
        var y = rootNode.circle.y;
        var radius = rootNode.circle.radius;
        var process = rootNode.process;
        var name = rootNode.name;
        //线条
        drawLineTo(x, y);
        //底圆
        drawWholeCircel(x, y, CONSTANTS.colors.rootBottom, radius);
        //圆环
        context.beginPath();
        context.moveTo(x, y);
        //绘制百分比
        drawProcessAnimation(x, y, process, radius, function () {
            //中间区域
            drawWholeCircel(x, y, CONSTANTS.colors.rootInside, radius - CONSTANTS.ringWidth);
            //文字
            process > 0 && drawText(x, y - CONSTANTS.fontSize / 2 - 5, name, CONSTANTS.colors.rootText);//第一行(中间网上移动)
            process <= 0 && drawText(x, y, name, CONSTANTS.colors.rootText);//第一行(无百分比，显示在正中间)
            process > 0 && drawText(x, y + CONSTANTS.fontSize / 2 + 5, process + '%', CONSTANTS.colors.rootText);//第二行(中间网下移动)
        });

        return true;
    };

    //绘制节点与中心节点之间的连线
    var drawLineTo = function (x, y) {
        context.beginPath();
        context.moveTo(center.x, center.y);
        context.lineTo(x, y);
        context.strokeStyle = CONSTANTS.colors.line;
        context.stroke();
    };

    //缓存集合，用于临时存储所有节点的参数
    var nodeCache = [];
    //添加节点到缓存集合中
    var collectCache = function (process, name, id, hitEnd, fn) {
        var circle;
        var radius;
        var getCircleThread;
        radius = calTextWidth(name);
        radius = radius < CONSTANTS.minRadius ? CONSTANTS.minRadius : radius;
        radius = radius > CONSTANTS.maxRadius ? CONSTANTS.maxRadius : radius;

        //增加节点缓存操作
        function push() {
            nodeCache.push({
                circle: circle,
                process: process,
                name: name,
                id: id
            });
            //到达最后一个节点，开始绘制动作
            hitEnd && flush();
        }

        //当前画布中没有节点，就是中点圆（因为第一步绘制中心节点）
        if (nodeCache.length < 1) {
            (circle = center) && (circle.radius = radius) && push();
        } else if (nodeCache.length >= 1) {//画布中已有节点
            //线程中获取圆圈参数(webworker)
            getCircleThread = new Worker(THREAD_JS_URL);
            //参数传输到线程中（webworker无法获取window、dom等）
            getCircleThread.postMessage({
                radius: radius,
                //为什么要stringify和parse: http://stackoverflow.com/questions/2323778/how-to-debug-web-workers
                imports: JSON.stringify({
                    canvasHeight: canvasHeight,
                    canvasWidth: canvasWidth,
                    center: center,
                    rootNode: rootNode,
                    circleCache: circleCache
                })
            });
            getCircleThread.addEventListener('message', function (event) {
                circle = event.data;
                circleCache.push(circle);
                push();
                typeof fn === 'function' && fn();
            });
        }
    };

    var flush = function () {
        var i, len = nodeCache.length;
        var x, y;
        //线绘制线条
        for (i = 1; i < len; i++) {//注意此处i从1开始
            x = nodeCache[i].circle.x;
            y = nodeCache[i].circle.y;
            drawLineTo(x, y);
        }
        //绘制根节点（白色）及线条
        rootNode && drawRootNode();
        //绘制节点
        for (i = 0; i < len; i++) {
            drawNode(nodeCache[i].circle, nodeCache[i].process, nodeCache[i].name);
        }
        //打开鼠标悬浮事件
        mouseEvents.on();

        //当前叶子节点的父节点指针指向当前中心节点
        for (i = 1; i < len; i++) {
            rootMap[nodeCache[i].id.toString()] = nodeCache[0];
        }
    };

    var drawMap = exports.drawMap = function (id) {
        var ajaxConfig = {
            url: FETCH_URL,
            dataType: 'json',
            data: 'id=' + id,
            success: draw,
            error: draw
        };

        jQuery.ajax(ajaxConfig);
    };

    //数据解析及绘制动作入口
    function draw(data) {
        data = data && data.length ? data : testData;
        if (!data || !data.length) {
            return false;
        }
        fadeOutCanvas(function () {
            var i = -1, len = data.length, d, rate, id, name, hitEnd;
            //中心节点
            collectCache(centerNode.process, centerNode.name, centerNode.id, !len);
            //叶子节点
            //此处不好理解，webworker属于异步操作，故此处不好使用for循环，而是把计算下一个节点操作变成前一个节点计算完成后的回调
            function continuousCollect() {
                i++;
                if (i === len) {
                    return;
                }
                d = data[i];
                id = d.id;
                rate = d.plSuccRate ? d.plSuccRate * 100 : 0;
                name = d.name;
                hitEnd = i === (len - 1);
                collectCache(rate, name, id, hitEnd, continuousCollect);
            }
            continuousCollect();
        });
    }

    //鼠标悬浮在节点中时，显示手型
    var mouseEvents = {
        from: {
            x: canvas.getBoundingClientRect().left + window.scrollX,
            y: canvas.getBoundingClientRect().top + window.scrollY
        },
        on: function () {
            canvas.addEventListener('mousemove', mouseEvents.mousemoveHandler);
            canvas.addEventListener('click', mouseEvents.clickHandler);
        },
        off: function () {
            canvas.style.cursor = '';
            canvas.removeEventListener('mousemove', mouseEvents.mousemoveHandler);
            canvas.addEventListener('click', mouseEvents.clickHandler);
        },
        insideANode: function (x, y, node) {
            var nodeX = node.circle.x;
            var nodeY = node.circle.y;
            var d = Math.pow(Math.pow((x - nodeX), 2) + Math.pow((y - nodeY), 2), 1 / 2);
            if (d < node.circle.radius) {
                return true;
            }
            return false;
        },
        //根据当前鼠标位置对应的画布坐标获取当前鼠标所处的节点
        getNode: function (e) {
            var x = e.pageX - mouseEvents.from.x;
            var y = e.pageY - mouseEvents.from.y;
            e.preventDefault();
            e.stopPropagation();
            for (var i = 1, len = nodeCache.length; i < len; i++) {
                if (mouseEvents.insideANode(x, y, nodeCache[i])) {
                    return nodeCache[i];
                }
            }
            if (rootNode && mouseEvents.insideANode(x, y, rootNode)) {
                return rootNode;
            }
            return null;
        },
        mousemoveHandler: function (e) {
            var node = mouseEvents.getNode(e);
            if (node) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = '';
            }
        },
        clickHandler: function (e) {
            var node = mouseEvents.getNode(e);
            var myRoot;
            if (node) {
                //获取点击节点的根节点
                myRoot = rootMap[node.id.toString()];
                if (myRoot) {
                    //点击后当前中心节点变成根节点
                    rootNode = exports.rootNode = {
                        name: myRoot.name,
                        process: myRoot.process,
                        id: myRoot.id,
                        circle: {}
                    };
                    //根节点固定在左上角
                    //leftTop.push(rootNode);
                    rootNode.circle.x = rootNode.circle.y = rootNode.circle.radius = myRoot.circle.radius;
                } else {
                    rootNode = null;
                }
                //点击的节点变成中心节点
                centerNode = node;
                drawMap(node.id);
            }
        }
    };

    //页面入口：页面载入时默认加载百度下的节点
    (function () {
        centerNode = {name: '基础技术与平台体系', id: 14787145, process: 0};
        drawMap(centerNode.id);
    }());

}('canvas', window.NodeTree = {}));