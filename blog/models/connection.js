/*
 * 链接数据库方法
 */

exports.exec = function (operation, callback) {
    var mysql = require('mysql');
    var config = require('./db.json');//数据库配置
    var con = mysql.createConnection(config);

    con.connect();

    con.query(operation, function (err, rows, fields) {
        if (err) {
            callback.call(this, err);
            return;
        }
        callback.call(this, {
            'rows': rows,
            'fields': fields
        });
    });
    
    con.end();
};