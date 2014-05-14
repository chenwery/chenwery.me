
/**
 * Module dependencies.
 */

var express = require('express');

var http = require('http');
var path = require('path');

var app = express();

//路由规则入口
var routers = require('./routes/routers');

var view;

// all environments
app.set('port', process.env.PORT || 3000);

//模板(jade)文件位置配置
if (path.sep === '\\') {//windows(test environments)
    view = path.join(__dirname, '../template.chenwery.blog');
} else {//linux/unix(online environments)
    view = '/home/web/template.chenwery.blog';
}
app.set('views', view);
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));

//静态文件路径配置
if (path.sep === '\\') {//windows(test environments)
    app.locals.staticPath = 'http://localhost/';
} else {//linux/unix(online environments)
    app.locals.staticPath = 'http://static.chenwery.me/';
}

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

routers.route(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});