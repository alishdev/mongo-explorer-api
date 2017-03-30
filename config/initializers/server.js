// config/initializers/server.js

var express = require('express');
var path = require('path');
var exphbs  = require('express-handlebars');
// Local dependecies
var config = require('nconf');

// create the express app
// configure middlewares
var bodyParser = require('body-parser');
var morgan = require('morgan');
var logger = require('winston');
var app;

var start =  function(cb) {
  'use strict';
  // Configure express 
  app = express();

  app.engine('handlebars', exphbs({defaultLayout: '../../app/views/layouts/main'}));
  app.set('view engine', 'handlebars');
  app.set('views', __dirname + '/../../app/views');

  app.use(morgan('common'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({type: '*/*'}));

      // use middleware to read headers and get mongo db properties
  app.use(function(req, res, next){
      // read mongo server properties from the header
      req.mongoServer = req.headers['mongo-server'];
      req.mongoPort = req.headers['mongo-server-port'];
      next();
  });

  logger.info('[SERVER] Initializing routes');

  var routes = require('../../app/routes/');
  app.use('/', routes);

  app.use(express.static(path.join(__dirname, 'public')));

  // Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (app.get('env') === 'development' ? err : {})
    });
    next(err);
  });

  app.listen(config.get('NODE_PORT'));
  logger.info('[SERVER] Listening on port ' + config.get('NODE_PORT'));
  
  if (cb) {
    return cb();
  }
};

module.exports = start;