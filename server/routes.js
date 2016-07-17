'use strict';

var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
module.exports = function(app) {
  var api = require('./api/download.controller');

  app.use('/healthcheck', require('express-healthcheck')({
    healthy: function () {
      return { status: 'UP' };
    }
  }));
  app.get('/api/getBarChartData',api.getBarChartData);
  app.get('/api/getPieChartData',api.getPieChartData);

  // All undefined asset or api routes should return a 404
  app.route('/:url(download|api|client|components|styles|bower_components|assets|fonts|scripts|views)/**').get(function(req, res) {
    res.sendFile(path.resolve(app.get('appPath') + '/404.html'));
  });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
