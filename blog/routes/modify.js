/*
 * 修改文章
 */
'use strict';
exports.modifyPage = function (request, response) {
    response.render('modify/modify');
};

exports.modify = function (request, response) {
    response.render('pub/publish');
};