/*
 * ALL Route Regulars (controllers)
 */
exports.route = function (server) {
    var controllers = require('./controllers.json'),
        controller,
        module,
        i, x, y, leni, lenx, leny;

    for (i = 0, leni = controllers.length; i < leni; i++) {
        controller = controllers[i];
        module = require(controller.module);
        if (controller.get && controller.get.length) {
            for (x = 0, lenx = controller.get.length; x < lenx; x++) {
                server.get(controller.get[x].path, module[controller.get[x].method]);
            }
        }
        if (controller.post && controller.post.length) {
            for (y = 0, leny = controller.post.length; y < leny; y++) {
                server.post(controller.post[y].path, module[controller.post[y].method]);
            }
        }
    }
};