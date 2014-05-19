/*
 * 发表文章
 */
'use strict';
exports.render = function (request, response) {
    response.render('pub/publish');
};

exports.publish = function (request, response) {
    var connection = require('../models/connection');
    var info = request.body;
    var title = escape(info.title);
    var description = info.description.replace(/\s/g, '-');
    var content = escape(info.content);
    var postListSql = 'insert into postList (title, description, createTime, lastModify, read_times) values (' +
        '\'' + title + '\', ' +
        '\'' + description + '\', ' +
        '\'' + Date.now() + '\', ' +
        '\'' + Date.now() + '\', ' +
        '0' +
        ')';
    var postContentSql = 'insert into postContent (title, description, createTime, content) values(' +
        '\'' + title + '\', ' +
        '\'' + description + '\', ' +
        '\'' + Date.now() + '\', ' +
        '\'' + content + '\'' +
        ')';
    var successCount = 0;

    if (!title || ! description || !content) {
        response.redirect('/publish');
        console.log('Error: without title or description or contents');
        return;
    }

    connection.exec(postListSql, function (result) {
        render(result, function () {
            connection.exec(postContentSql, render);
        });
        
    });

    function render(result, next) {
        console.log(result);
        if (!result.rows) {
            response.redirect('/publish');
            return;
        }
        successCount++;
        if (successCount === 2) {
            console.log('now render');
            response.render('pub/publish', {
                modify: true
            });
            return;
        }
        typeof next === 'function' && next();
    }
};

exports.modify = function (request, response) {

};