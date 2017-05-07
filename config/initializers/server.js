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
  var port = process.env.PORT || config.get('http:port');

  setAppMiddleware(app);

      // use middleware to read headers and get mongo db properties
  app.use(function(req, res, next){
      readHeadersHandler(req, res, next);
  });

    // set routes
  logger.info('[SERVER] Initializing routes');
  var routes = require('../../app/routes/');
  app.use('/', routes);

  // Error handler
  app.use(function(err, req, res, next){
    errorHandler(err, req, res, next);
  });

  // serve swagger
  var swaggerHost = config.get('swagger:host');
  var swaggerSpec = initSwagger(swaggerHost);
  app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

    // listen
  app.listen(port);
  logger.info('[SERVER] Listening on port ' + port);
  logger.info('[SERVER] Swagger host ' + swaggerHost);
  
    // return to callback function
  if (cb) {
    return cb();
  }
};

/**
 * Set essential middleware in express app
 * @method
 * @param {object} express app instance
 * @return {void}
 */
function setAppMiddleware(app){
  app.engine('handlebars', exphbs({defaultLayout: '../../app/views/layouts/main'}));
  app.set('view engine', 'handlebars');
  app.set('views', __dirname + '/../../app/views');

  app.use(morgan('common'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({type: '*/*'}));

  // set CORS
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(express.static(path.join(__dirname, '../../app/public')));
}

/**
 * Error handler
 * @method
 * @param {object} error
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @return 500 status in case of error
 */
function errorHandler(err, req, res, next){
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (app.get('env') === 'development.js' ? err : {})
    });
    next(err);
}

/**
 * Read every request header and build connection string from header parameters
 * @method
 * @param {object} error
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @return {void}
 */
function readHeadersHandler(req, res, next){
    // read mongo server properties from the header
    var parseConnectionString = require('../../app/helpers/request-helper');
    if (!parseConnectionString.isAPICall(req))
      next();
    else{
      parseConnectionString.parseConnectionString(req, logger);
      next();
    }
}

/**
 * Initialize swagger UI
 * @method
 * @param {string} swaggerHost name of the server that hosts swagger doc 
 * @return {object} swaggerJSDoc swagger spec
 */
function initSwagger(swaggerHost)
{
  // swagger definition
  var swaggerDefinition = {
    info: {
      title: 'Mongo Explorer API',
      version: '1.0.0',
      description: 'Explore any Mongo database',
    },
    host: swaggerHost,
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
  return swaggerJSDoc(options);
}

module.exports = start;