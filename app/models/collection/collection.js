// models/db/db.js
// Db class
var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    logger = require('winston'),
    co = require('co');
var dbHelper = require('../../helpers/db-helper');

function get(connectionString, collName, cb) {
    return co(function*() {
        let url = dbHelper.getMongoURL(connectionString, logger);
        let db;
        try
        {
            db = yield MongoClient.connect(url, {ssl:connectionString.ssl});
            // Retrieve the statistics for the collection
            let collection = db.collection(collName);
            let stats = yield collection.stats();
            let collStats = {
                name: collName,
                docsCount: stats.count,
                size : stats.size,
                avgObjSize: stats.avgObjSize,
            };

                // get index information
            let indexes = yield collection.indexes();
            collStats.indexes = indexes.map(idx => idx.name);

            cb(null, collStats);
        }
        catch(e)
        {
            logger.error(e.message);
            return cb(e);
        }
        finally{
            if (db)
                db.close();
        }
    });
}

// Get all databases
function all(connectionString, cb) {
    return co(function*() {
        let url = dbHelper.getMongoURL(connectionString, logger);
        let db;
        try
        {
            db = yield MongoClient.connect(url, {ssl:connectionString.ssl});
            let collections = yield db.listCollections().toArray();

            const collFound = collections.map(function(coll){return coll.name;});
            cb(null, collFound);
        }
        catch(e)
        {
            logger.error(e.message);
            return cb(e);
        }
        finally{
            if (db)
                db.close();
        }
    });
}

exports.all = all;
exports.get = get;