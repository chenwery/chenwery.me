
/*
 * GET home page.
 */
'use strict';
exports.index = function (req, res) {
    var connection = require('../models/connection');
    var sql = 'select * from postList where description <> \'lab\' order by id desc';
    
    function renderPostList(result) {
        var rows = result.rows;
        var list = [];
        var post;
        var date;
        var i, len;

        for (i = 0, len = rows.length; i < len; i++) {
            post = list[i] = {};
            date = new Date(parseInt(rows[i].createTime));
            post.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            post.title = unescape(rows[i].title);
            post.description = encodeURIComponent(rows[i].description);
        }

        res.render('index', {
            isIndexPage: true,
            postList: list
        });
    }

    connection.exec(sql, renderPostList);

};