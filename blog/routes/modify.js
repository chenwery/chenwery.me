/*
 * 修改文章
 */
'use strict';
exports.modifyPage = function (request, response) {
    var description = request.params.description;
    var connection = require('../models/connection');
    var findStr = 'select title, content from postContent where description = \'' + description + '\'';
    connection.exec(findStr, function (result) {
        var article;
        if (result.rows && result.rows.length) {
            article = result.rows[0];
            response.render('add/add', {
                type: '修改',
                method: 'modify',
                id: article.id,
                title: '修改文章',
                postTitle: unescape(article.title),
                description: description,
                content: unescape(article.content)
            });
        } else {
            response.render('add/add', {
                type: '无法找到你要修改的',
                method: 'modify',
                id: '',
                title: ' 修改文章',
                postTitle: '',
                description: '',
                content: ''
            });
        }
    });
};

exports.modify = function (request, response) {
    var connection = require('../models/connection');
    var info = request.body;
    var title = escape(info.title);
    var description = info.description.replace(/\s/g, '-');
    var originDescription = info.originDescription;
    var content = escape(info.content);
    var postListSql, postContentSql;
    var successCount;
    if (!title || ! description || !content) {
        response.redirect('/add');
        return;
    }
    postListSql = 'update postList set ' +
        'title = \'' + title + '\', ' +
        'description = \'' + description + '\', ' +
        'lastModify = \'' + Date.now() + '\' ' +
        'where description = \'' + originDescription + '\'';
    postContentSql = 'update postContent set ' +
        'title = \'' + title + '\', ' +
        'description = \'' + description + '\', ' +
        'content = \'' + content + '\' ' +
        'where description = \'' + originDescription + '\'';
    successCount = 0;

    connection.exec(postListSql, function (result) {
        render(result, function () {
            connection.exec(postContentSql, render);
        });
        
    });

    function render(result, next) {
        //console.log(result);
        if (!result.rows) {
            response.redirect('/modify/' + description);
            return;
        }
        successCount++;
        if (successCount === 2) {
            response.redirect('/post/' + description);
            return;
        }
        typeof next === 'function' && next();
    }
};