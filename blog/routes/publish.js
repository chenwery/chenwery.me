/*
 * 发表文章
 */
exports.render = function (request, response) {
    response.render('publish/publish', {
        'id': 'test'
    });
};

exports.publish = function(request, response) {
    console.log(request.body);
}