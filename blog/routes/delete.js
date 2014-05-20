/*
 * 删除
 */
'use strict';

exports.list = function (request, response) {
    response.render();
};

exports.delete = function (request, response) {
    response.redirect('/');
};