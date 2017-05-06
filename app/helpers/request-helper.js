// app/helpers/request-helper.js

// header or parameter names
const HEADER_SERVER_NAME = 'mongo-server';
const HEADER_PORT_NAME = 'mongo-server-port';
const HEADER_USER_NAME = 'mongo-server-user';
const HEADER_PASSWORD_NAME = 'mongo-server-password';
const HEADER_SSL_NAME = 'mongo-server-ssl';

// default values
const DEFAULT_MONGO_SERVER = 'localhost';
const DEFAULT_MONGO_PORT = 27017;

/**
 * Parse HTTP request headers and parameters and converts them into request parameters 
 * Substitutes default values when header value or parameter is not defined
 * @method
 * @param {object} req HTTP request.
 * @param {object} logger Winston logger.
 * @return {void}
 */
exports.parseConnectionString = function(req, logger){
    req.connectionString = {};
    req.connectionString.server = req.headers[HEADER_SERVER_NAME] || DEFAULT_MONGO_SERVER;
    req.connectionString.port = req.headers[HEADER_PORT_NAME] || DEFAULT_MONGO_PORT;
    req.connectionString.user = req.headers[HEADER_USER_NAME] || null;
    req.connectionString.password = req.headers[HEADER_PASSWORD_NAME] || null;
    req.connectionString.ssl = req.headers[HEADER_SSL_NAME] || false;

    // all urls start with /db/:dbName, so by splitting url we can find database name    
    var urlTokens = req.originalUrl.split("/");
    logger.info(urlTokens);
    if (urlTokens.length > 2){
        if (urlTokens[1] === 'api' && urlTokens[2] === 'db')  // skip first token and check if second token is api and third is db
            req.connectionString.dbName = urlTokens[3];
    }

    if (logger){
        logger.info(`connection string: 
            server = ${req.connectionString.server}, 
            port = ${req.connectionString.port}
            user = ${req.connectionString.user}
            password = ${req.connectionString.password}
            dbName = ${req.connectionString.dbName}
            ssl = ${req.connectionString.ssl}`);
    }
};

/**
 * Parse HTTP request url and return true if it starts with api/db
 * @method
 * @param {object} req HTTP request.
 * @return {boolean}
 */
exports.isAPICall = function(req){
    return req.originalUrl.startsWith("/api/db");
};