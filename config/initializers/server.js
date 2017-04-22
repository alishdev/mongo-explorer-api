// config/initializers/server.js

var swaggerJSDoc = require('swagger-jsdoc');
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
  var port = process.env.PORT || config.get('NODE_PORT');

  // swagger definition
  var swaggerDefinition = {
    info: {
      title: 'Mongo Explorer API',
      version: '1.0.0',
      description: 'Explore any Mongo database',
    },
    host: 'https://dry-spire-23794.herokuapp.com',
    basePath: '/',
  };

  // options for the swagger docs
  var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: [__dirname + '../../app/routes/*.js', 
          __dirname + '/../../app/routes/db/*.js',
          __dirname + '/../../app/routes/collection/*.js',
          __dirname + '/../../app/routes/document/*.js'],
  };

  // initialize swagger-jsdoc
  var swaggerSpec = swaggerJSDoc(options);


  app.engine('handlebars', exphbs({defaultLayout: '../../app/views/layouts/main'}));
  app.set('view engine', 'handlebars');
  app.set('views', __dirname + '/../../app/views');

  app.use(morgan('common'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({type: '*/*'}));

      // use middleware to read headers and get mongo db properties
  app.use(function(req, res, next){
      // read mongo server properties from the header
      // req.connectionString = {};
      // req.connectionString.server = req.headers['mongo-server'] || 'localhost';
      // req.connectionString.port = req.headers['mongo-server-port'] || 27017;
      // logger.info(req.connectionString);
      var parseConnectionString = require('../../app/helpers/request-helper');
      if (!parseConnectionString.isAPICall(req))
        next();
      else{
        parseConnectionString.parseConnectionString(req, logger);

        var dbHelper = require('../../app/helpers/db-helper');
        dbHelper.getMongoConnection(req.connectionString, logger, function(err, db){
          if (err){
            res.status(err.status || 500);
            res.json({
              message: err.message,
              error: (app.get('env') === 'development.js' ? err : {})
            });
          }
          else{
            req.connectionString.mongoDb = db;
            next();
          }
        });
      }
  });

  logger.info('[SERVER] Initializing routes');
  app.use(express.static(path.join(__dirname, '../../app/public')));

  var routes = require('../../app/routes/');
  app.use('/', routes);

  // Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (app.get('env') === 'development.js' ? err : {})
    });
    next(err);
  });

  // serve swagger
  app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.listen(port);
  logger.info('[SERVER] Listening on port ' + port);
  
  if (cb) {
    return cb();
  }
};

module.exports = start;