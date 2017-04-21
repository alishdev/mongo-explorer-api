// models/db/db.js
// Db class
var Database = require('mongodb').Db,
    Server = require('mongodb').Server,
    logger = require('winston');

// Get particular database properties
exports.get = function(connectionString, dbName, cb) {
    logger.info("Inside db.get, dbName: " + dbName);
    logger.info(connectionString.server);
    logger.info(connectionString.port);
    logger.info(connectionString.dbName);

    var db = connectionString.mongoDb;

    var res = {name: dbName, collections : []};
    db.listCollections().toArray(function(err, collections) {
        db.close();
        // collections is an array of collection info objects that look like:
        // { name: 'test', options: {} }
        if (err)
            cb(err);
                        
        collections.forEach(function(coll){
            res.collections.push(coll.name);
        });

        cb(null, res);    
    });
}

// Get all databases
 function allDbs(connectionString, cb) {
    logger.info("Inside db.all");
    //logger.info(connectionString);

    var db = new Database('test', new Server(connectionString.server, connectionString.port));
    // Establish connection to db
    db.open(function(err, db) {
        if (err)
            cb(err);
        // Use the admin database for the operation
        var adminDb = db.admin();

        // List all the available databases
        adminDb.listDatabases(function(err, dbs) {
            db.close();
            //logger.info(dbs);
            
            if (err)
                cb(err);

            const dbFound = dbs.databases.map(function(db1){return db1.name;});
            cb(null, dbFound);
        });
    });
}

exports.all = allDbs;