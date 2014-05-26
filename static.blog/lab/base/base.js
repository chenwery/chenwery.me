(function (global, undefined) {
    var jPure,
        $$,
        XHR = global.XMLHttpRequest;

    $$ = jPure = function (selector) {
        return new $$.fn.init(selector);
    };

    $$.fn = $$.prototype = {
        version: '0.0.0',
        init: function (selector) {
            //TODO
        }
    };

    //对象转为查询串
    //(eg: {key1: 123, key2: 456}  =>  'key1=123&key2=456')
    function serialize(object) {
        var rst,
            key,
            val;

        if (typeof object === 'string') {
            return object.trim();
        }

        if (!object || object.constructor !== Object/* || object.constructor !== Array //TODO*/) {
            return null;
        }

        rst = '';
        for (key in object) {
            val = typeof object[key] === 'object' ? JSON.stringify(object[key]) : object[key];
            rst += key + '=' + val + '&';//TODO what if (object[key] === 'q&key=val')
        }

        rst = rst.replace(/&$/, '');
        console.log(rst);
        return rst;
    }

    $$.ajax = function (options) {
        var xhr,
            type = options.type && typeof options.type === 'string' ?
                options.type.toLowerCase() :
                'get',
            url = options.url && typeof options.url === 'string' ?
                options.url.trim() :
                '',
            sync = options.sync || true,
            data = serialize(options.data),
            responseType = options.responseType && typeof options.responseType === 'string' ?
                options.responseType.toLowerCase() :
                null,
            successHandler = options.success || function () {},
            errorHandler = options.error || function () {},
            msg;
        
        if (!url) {
            return;
        }
        if (type === 'get') {
            url += '?' + data;
            msg = null;
        } else {
            msg = data;
        }

        xhr = new XHR();
        xhr.onreadystatechange = function (event) {
            var response;
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    response = xhr.responseText;
                    if (responseType === 'json') {
                        try {
                            response = JSON.parse(response);
                        } catch(e) {
                            response = null;
                        }
                    }
                    successHandler(response);
                } else {
                    errorHandler({status: xhr.status});
                }
                return;
            }
        };
        xhr.open(type, url, sync);
        if (type === 'post') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.send(msg);

        return xhr;
    };

    $$.ajax.before = function () {};//TODO
    $$.ajax.after = function () {};

    global.$$ = global.jPure = $$;
})(window);