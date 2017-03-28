// models/db/db.js
// Db class

// first test with json file
const data = require('./testdb.json');

// Get particular database properties
exports.get = function(dbName, cb) {
    dbName = dbName || '';
    const db = data.dbs.find(x => x.name === dbName);
    if (!db)
        return cb('Database not found: ' + dbName);
    cb(null, {name:db.name, colCount: db.collections.length});
}

// Get all databases
exports.all = function(cb) {
    const dbs = data.dbs.map(function(db){return db.name;});
    cb(null, dbs);
}