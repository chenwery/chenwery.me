'use strict';

//线程运行过程中imports由主线程通过postMessage传入
var imports;

//返回两点之间随机数
var randomNum = function (start, end) {
    return Math.min(start, end) + Math.ceil(Math.abs(end - start) * Math.random());
};

//判断两个圆有没有交点（用于防止节点间有碰撞）
var haveCrossoverCircel = function (circle1, circle2) {
    var x = Math.abs(circle1.x - circle2.x);
    var y = Math.abs(circle1.y - circle2.y);
    //勾股定理
    var z = Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 0.5);
    z = Math.floor(z);
    return z <= (circle1.radius + circle2.radius);
};

//判断圆与线之间有没有交点（线指的是中心圆与相邻圆之间的连线，故需要提供相邻圆的圆心）
//点线距离公式（呵呵初中白学了）
//http://wenku.baidu.com/link?url=d2rTn8EoYsB5PxgRjQC7AoYhBBJ_hjX-savbWCNBUsli1MMBC7TSsZaFVXldL_awDopMzLT9Th1KyTBc7QDah1foi6q_Xw54NysVy1aYi6m
var haveCrossoverLine = function (circle, sibling) {
    //var d, A, B, C, p, flag;//求点p到直线方程Ax + By = C的距离d
    var d;
    var pointX = circle.x - imports.center.x;
    var pointY = - (circle.y - imports.center.y);
    var x = sibling.x - imports.center.x;
    var y = - (sibling.y - imports.center.y);
    //flag = x / y; ====> x = flag * y; ====> x - flag * y = 0; ====> A == 1; B == -flag === (- (x / y)); C == 0;
    //d = Math.abs(A * pointX + B * pointY + C) / Math.pow((Math.pow(A, 2) + Math.pow(B, 2)), 0.5);
    d = Math.abs(1 * pointX + (- (x / y)) * pointY + 0) / Math.pow((Math.pow(1, 2) + Math.pow((- (x / y)), 2)), 1 / 2);
    d = Math.floor(d);
    return d <= circle.radius;
};

//haveCrossoverLine只保证circle不与sibling的线重合，不保证sibling不与circle的线不重合
//故需要倒过来判断一下才能保证两个节点与对方的线不重合
var haveCrossoverLineEachother = function (circle1, circle2) {
    return haveCrossoverLine(circle1, circle2) || haveCrossoverLine(circle2, circle1);
};

//获取满足条件的随机圆(x/y/radius)
var getCircle = function (config) {
    var circle;
    var siblings = config.siblings;
    var xStart = config.xStart;
    var xEnd = config.xEnd;
    var yStart = config.yStart;
    var yEnd = config.yEnd;
    var radius = config.radius;
    var i, len = siblings.length;

    circle = {
        radius: radius,
        x: randomNum(xStart, xEnd),
        y: randomNum(yStart, yEnd)
    };

    //与中点圆有重合则重新递归获取
    if (haveCrossoverCircel(imports.center, circle)) {
        return getCircle(config);
    }
    try {
        //与同一区域的圆有重合则重新递归获取
        for (i = 0; i < len; i++) {
            if (haveCrossoverCircel(siblings[i], circle) || haveCrossoverLineEachother(circle, siblings[i])) {
                return getCircle(config);
            }
        }
        /*for (i = 0; i < len; i++) {
            if (haveCrossoverLineEachother(circle, siblings[i])) {
                return getCircle(config);
            }
        }*/
        //与根节点圆有重合则重新递归获取
        if (imports.rootNode && (haveCrossoverCircel(imports.rootNode.circle, circle) || haveCrossoverLineEachother(circle, imports.rootNode.circle))) {
            return getCircle(config);
        }
    } catch (e) {}
    //与中点圆/根节点/同一区域的圆都没有交点
    //siblings.push(circle);
    return circle;
};

//根据象限值和半径获取该象限的随机圆(x/y/radius)(同时保证该圆不与其他节点有重合/相交的情况)
var randomCircle = function (radius) {
    var siblings;
    var xEnd, yEnd;
    var xStart, yStart;

    xEnd = imports.canvasWidth - radius;
    yEnd = imports.canvasHeight - radius;
    xStart = radius;
    yStart = radius;
    siblings = imports.circleCache;

    return getCircle({
        siblings: siblings,
        xStart: xStart,
        xEnd: xEnd,
        yStart: yStart,
        yEnd: yEnd,
        radius: radius
    });
};

//监听主线程的消息
addEventListener('message', function (event) {
    var circle;
    var radius = event.data.radius;
    //为什么要stringify和parse: http://stackoverflow.com/questions/2323778/how-to-debug-web-workers
    imports = JSON.parse(event.data.imports);
    circle = randomCircle(radius);
    postMessage(circle);
    close();//一次性操作，所以最好直接关闭此线程
});