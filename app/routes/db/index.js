// routes/db/index.js
// route file for MongoDB databases
var logger = require('winston');

let router = require('express').Router(),
    database = require('../../models/db/db');

router.get('/:dbName/collection', function(req, res) {    
    database.get(req.params.dbName, function(err, db){
        if (err)
            res.status(404).send(err);
        res.status(200).json(db);
    });
});

router.get('/:dbName', function(req, res) {    
    database.get(req.params.dbName, function(err, db){
        if (err)
            res.status(404).send(err);
        res.status(200).json(db);
    });
});

router.get('/', function(req, res) {
    database.all(function(err, dbs){
        if (err)
            res.status(404).send(err);
        
        res.status(200).json(dbs);
    });
});

module.exports = router;