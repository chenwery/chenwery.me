/*
 * 链接数据库方法
 */
'use strict';
exports.exec = function (operation, callback) {
    var mysql = require('mysql');
    var config = require('../../../db.json');//数据库配置文件
    /*
        db.json:
        {
          "host": "数据库主机（ip或域名）",
          "user": "用户名",
          "password": "密码",
          "database": "数据库"
        }
     */
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