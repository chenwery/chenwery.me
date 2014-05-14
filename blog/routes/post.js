exports.render = function (request, response) {
    var title = escape(request.params.name);
    var sql = 'select title, content, date from postContent where title = "' + title + '"';
    var connection = require('../models/connection');

    connection.exec(sql, renderPost);

    function renderPost(result) {
        var post = result.rows && result.rows.length ? result.rows[0] : null,
            date;

        if (!post) {
            post = {};//TODO
        }

        date = (post.date + '').split(' ');
        post.date = date[1] + ' ' + date[2] + ', ' + date[3];

        response.render('post/post', {
            title: unescape(post.title),
            isPostPage: true,
            postTitle: unescape(post.title),
            date: post.date,
            content: unescape(post.content)
        });
    }
};