/*
 * Translation (app of Baidu Fanyi demo)
 * http://developer.baidu.com/wiki/index.php?title=%E5%B8%AE%E5%8A%A9%E6%96%87%E6%A1%A3%E9%A6%96%E9%A1%B5/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91/%E7%BF%BB%E8%AF%91API
 */
'use strict';
exports.index = function (req, resp) {
    resp.render('translation/translation', {});
};

exports.translate = function (req, resp) {
    var options,
        from = req.body.from || 'auto',
        to = req.body.to || 'auto',
        q = req.body.q || '',
        data = '',
        rst,
        queryStr,
        http = require('http');

    queryStr = '&from=' + from + '&to=' + to + '&q=' + q;
    options = {
        host: 'openapi.baidu.com',
        port: 80,
        path: '/public/2.0/bmt/translate?client_id=CXNqm5tL8oybtwAX1LBpF832' + queryStr
    };
    console.log('translate: ' + q + '\nform: ' + from + '\nto: ' + to);

    http.get(options, function (res) {
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            rst = JSON.parse(data);
            if (rst) {
                resp.send(rst);
            }
        });
        res.on('error', function (e) {
            console.log('There was an error: ' + e.message);
        });
    });
};