// app/helpers/request-helper.js
var Database = require('mongodb').Db,
    Server = require('mongodb').Server;

// Object to cache open connections
var DbList = {};

// default database name 
const DEFAULT_DB_NAME = 'default';

/**
 * Create hashed string from connectionString
 * @param {object} connectionString connection string from HTTP request.
 * @param {string} dbName database name optional.
 * @return {string}
 */
function hashConnectionString(connectionString){
    return connectionString.server + connectionString.port + (connectionString.dbName || DEFAULT_DB_NAME);
}

/**
 * Create mongo db variable from connectionString and cache it
 * @param {object} connectionString connection string from HTTP request.
 * @param {object} logger Winston logger.
 * @return {void}
 */
exports.getMongoConnection = function(connectionString, logger, callback){
    var hash = hashConnectionString(connectionString);
    logger.info(`getMongoConnection.hash = ${hash}`);
    if (hash in DbList){
        logger.info(`getMongoConnection hashed value found`);
        return callback(null, DbList[hash])
    }
    
    var db = 
        new Database(connectionString.dbName || DEFAULT_DB_NAME, 
            new Server(connectionString.server, 
                connectionString.port, 
                {ssl:connectionString.ssl === "true"}));
    logger.info(`getMongoConnection: opening new connection`);
    // Establish connection to db
    db.open(function(err, db) {
        if (err){
            logger.error(`getMongoConnection: failed to open new connection`);
            callback(err);
        }
        else{
            DbList[hash] = db;
            callback(null, db);
        }
    });
};