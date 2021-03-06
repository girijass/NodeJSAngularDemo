'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');
var props = require('./properties');


app.use(session({ secret: 'i am not telling you',cookie: { secure: false }}));

var excludeMiddlewareForPath = function(path, middleware) {
    return function(req, res, next) {
        if (path === req.path) {
          return next();
        } else {
          return middleware(req, res, next);
        }
    };
};



//app.use(excludeMiddlewareForPath('/healthcheck', Authentication.validateUser));

// Setup json parsing and body parser
var jsonParser = bodyParser.json({limit:'50mb', type:'application/json'});
var urlencodedParser = bodyParser.urlencoded({ extended:true, limit:'50mb', type:'application/x-www-form-urlencoding' });
app.use(jsonParser);
app.use(urlencodedParser);
app.set('appPath', 'client');
app.use(express.static(app.get('appPath')));
require('./routes')(app);

// Server env, ip, and port
var _env = process.env.NODE_ENV;
var _port = process.env.PORT || 3000;
var _ip = process.env.IP || '0.0.0.0';

// Start server
var server = http.createServer(app);
function startServer() {
  server.listen(_port, _ip, function() {
    console.log('Express server listening on %d, in %s mode', _port, _env);
  });
}

setImmediate(startServer);

module.exports = app;
