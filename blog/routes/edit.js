/*
 * 编辑页 （删除与修改功能入口）
 */
'use strict';
exports.edit = function (request, response) {
    var connection = require('../models/connection');
    var sql = 'select title, description from postList order by id desc';
    connection.exec(sql, function (result) {
        var postList = result.rows || [];
        var i = 0, len = postList.length;
        for (; i < len; i++) {
            postList[i].title = unescape(postList[i].title);
        }
        response.render('edit/edit', {
            postList: postList
        });
    });
};