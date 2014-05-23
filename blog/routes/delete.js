/*
 * 删除
 */
'use strict';
exports.delete = function (request, response) {
    var description = request.params.description;
    var connection = require('../models/connection');
    var postListSql = 'delete from postList where description = \'' + description + '\'';
    var postContentSql = 'delete from postContent where description = \'' + description + '\'';
    connection.exec(postListSql, function (result) {
        if (!result.rows) {
            return;
        }
        connection.exec(postContentSql, function (result) {
            if (!result.rows) {
                return;
            }
            response.redirect('/edit');
        });
    });
};