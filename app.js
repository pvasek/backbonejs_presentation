/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , hbs = require('hbs');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    //app.set('view engine', 'jade');
    app.set('view engine', 'html');
    app.engine('html', hbs.__express);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use('/public', express.static(path.join(__dirname, 'public')));

    app.set('pages directory', __dirname + '/views/pages/')

});

app.configure('development', function () {
    app.use(express.errorHandler());
});


app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
