exports.render = function (request, response) {
    var title = escape(request.params.name);
    var sql = 'select * from postContent where description = "' + title + '"';
    var connection = require('../models/connection');

    connection.exec(sql, renderPost);

    function renderPost(result) {
        var post = result.rows && result.rows.length ? result.rows[0] : null;
        var date;
        var title;
        var content;

        if (!post) {
            response.redirect('/');
            return;
        }

        date = new Date(parseInt(post.createTime));
        date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        title = unescape(post.title);
        content = unescape(post.content);

        response.render('post/post', {
            title: title,
            isPostPage: true,
            postTitle: title,
            date: date,
            content: content
        });
    }
};