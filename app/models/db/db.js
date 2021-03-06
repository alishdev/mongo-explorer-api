// models/db/db.js
// Db class
var MongoClient = require('mongodb').MongoClient,
    Database = require('mongodb').Db,
    Server = require('mongodb').Server,
    logger = require('winston'),
    co = require('co');
var dbHelper = require('../../helpers/db-helper');

// Get one particular database properties
exports.get = function(connectionString, dbName, cb) {
    logger.info("Inside db.get, dbName: " + dbName);

    return co(function*() {
        let url = dbHelper.getMongoURL(connectionString, logger);
        let res = {name: dbName, collections : []};
        let db;
        try
        {
            db = yield MongoClient.connect(url, {ssl:connectionString.ssl});
            let collections = yield db.listCollections().toArray();

            collections.forEach(function(coll){
                res.collections.push(coll.name);
            });

            logger.info(res);
            cb(null, res);
        }
        catch(e)
        {
            logger.info(e.message);
            return cb(e);
        }
        finally{
            if (db)
                db.close();
        }
    });
}

// Get all databases
function allDbs(connectionString, cb) {
    return co(function*() {
        let url = dbHelper.getMongoURL(connectionString, logger);
        let db;
        try
        {
            db = yield MongoClient.connect(url, {ssl:connectionString.ssl});
            let dbs = yield db.command({listDatabases:1});
            const dbFound = dbs.databases.map(function(db1){return db1.name;});
            cb(null, dbFound);
        }
        catch(e)
        {
            console.log(e.message);
            return cb(e);
        }
        finally{
            if (db)
                db.close();
        }
    });
}

exports.all = allDbs;