/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , project = require('./routes/project')
    , http = require('http')
    , path = require('path')
    , lessMiddleware = require('less-middleware')
    , hbs = require('hbs');

var app = express();

app.resource = function(path, obj) {
    this.get(path, obj.getList);
    this.get(path + '/:id', function(req, res){
        obj.get(req, res, parseInt(req.params.id, 10));
    });
    this.del(path + '/:id', function(req, res){
        obj.delete(req, res, parseInt(req.params.id, 10));
    });
    this.put(path + '/:id', function(req, res){
        obj.put(req, res, parseInt(req.params.id, 10));
    });
    this.post(path, obj.post);
};

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    //app.set('view engine', 'jade');
    app.set('view engine', 'html');
    app.engine('html', require('ejs').__express);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    app.use('/public', lessMiddleware({
        src: __dirname + '/public',
        compress: true
    }));

    app.use('/public', express.static(path.join(__dirname, 'public')));

    app.set('pages directory', __dirname + '/views/pages/')

});

app.configure('development', function () {
    app.use(express.errorHandler());
});


app.get('/slides', routes.index);
app.get('/slides/:slide', routes.index);
app.resource('/projects', project);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
