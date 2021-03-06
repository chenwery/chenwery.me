/*
 * 发表文章
 */
'use strict';
exports.render = function (request, response) {
    response.render('add/add', {
        type: '发表',
        method: 'add',
        title: '发表文章',
        postTitle: '',
        description: '',
        content: ''
    });
};

exports.add = function (request, response) {
    var connection = require('../models/connection');
    var info = request.body;
    var title = escape(info.title);
    var description = info.description.replace(/\s/g, '-');
    var content = escape(info.content);
    var postListSql, postContentSql;
    var successCount;
    if (!title || ! description || !content) {
        response.redirect('/add');
        return;
    }
    postListSql = 'insert into postList (title, description, createTime, lastModify, read_times) values (' +
        '\'' + title + '\', ' +
        '\'' + description + '\', ' +
        '\'' + Date.now() + '\', ' +
        '\'' + Date.now() + '\', ' +
        '0' +
        ')';
    postContentSql = 'insert into postContent (title, description, createTime, content) values(' +
        '\'' + title + '\', ' +
        '\'' + description + '\', ' +
        '\'' + Date.now() + '\', ' +
        '\'' + content + '\'' +
        ')';
    successCount = 0;

    connection.exec(postListSql, function (result) {
        render(result, function () {
            connection.exec(postContentSql, render);
        });
        
    });

    function render(result, next) {
        //console.log(result);
        if (!result.rows) {
            response.redirect('/add');
            return;
        }
        successCount++;
        if (successCount === 2) {
            //console.log('now render');
            /*response.render('pub/publish', {
                modify: true
            });*/
            response.redirect('/post/' + description);
            return;
        }
        typeof next === 'function' && next();
    }
};