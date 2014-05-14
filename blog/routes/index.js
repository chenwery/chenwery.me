
/*
 * GET home page.
 */

exports.index = function (req, res) {
    var connection = require('../models/connection');
    var sql = 'select title, pub_date from postList';
    
    function renderPostList(result) {
        var rows = result.rows,
            date, i, len;
        for (i = 0, len = rows.length; i < len; i++) {
            date = ('' + rows[i].pub_date).split(' ');
            rows[i].pub_date = date[1] + ' ' + date[2] + ', ' + date[3];
            rows[i].title = unescape(rows[i].title);
            rows[i].url = encodeURIComponent(rows[i].title);
        }
        res.render('index', {
            postList: rows
        });
    }

    connection.exec(sql, renderPostList);

};