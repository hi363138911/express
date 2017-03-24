var http = require('http');
var url = require('url');
var proto = {
    stack: []
};

function createServer() {
    var app = {
        task: function(req, res) {
            app.handle(req, res);
        }
    }
    //把proto中的属性拷贝到app对象里
    Object.assign(app, proto);
    return app;
}
//装载函数
proto.use = function(route, fn) {
    var path = route;
    var handle = fn;
    if (typeof route != 'string') {
        handle = route;
        path = "/";
    }
    this.stack.push({
        handle: handle,
        path: path
    });
}
//调用函数
proto.handle = function(req, res) {
    var stack = this.stack;
    var index = 0;

    function next(err) {
        var layer = stack[index++];
        var route = layer.path;
        var handle = layer.handle;

        var path = url.parse(req.url).pathname;
        //是否匹配路径,是否匹配开头
        if (path.startsWith(route)) {
            if (err) {
                if (handle.length == 4) {
                    handle(err, req, res, next);
                } else {
                    next(err);
                }
            } else {
                handle(req, res, next);
            }
        } else {
            next();
        }

    }
    next();
}

proto.listen = function(port) {
    var server = http.createServer(this.task);
    server.listen(port);
}

module.exports = createServer;
