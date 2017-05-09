// models/db/document.js

var MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    logger = require('winston'),
    co = require('co');
var dbHelper = require('../../helpers/db-helper');

// get single document
function get(connectionString, collName, docid, cb) {
    return co(function*() {
        let url = dbHelper.getMongoURL(connectionString, logger);
        let db;
        try
        {
            db = yield MongoClient.connect(url, {ssl:connectionString.ssl});
            var collection = db.collection(collName);

            var id = new ObjectID(docid);
            // Perform a simple find
            var doc = yield collection.findOne({'_id':id});

            cb(null, doc);
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

// Get range of documents
function range(connectionString, colname, rangeParams, cb) {
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

exports.range = range;
exports.get = get;