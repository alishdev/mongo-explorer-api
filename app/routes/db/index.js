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

/**
 * @swagger
 * definitions:
 *   Database:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/db/{dbName}:
 *   get:
 *     tags:
 *       - Databases
 *     description: Returns a single db
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: dbName
 *         description: Database name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single database
 *         schema:
 *           $ref: '#/definitions/Database'
 */
router.get('/:dbName', function(req, res) {    
    database.get(req.connectionString, req.params.dbName, function(err, db){
        if (err)
            res.status(404).send(err);
        res.status(200).json(db);
    });
});

router.get('/', function(req, res) {
    database.all(req.connectionString, function(err, dbs){
        if (err)
            res.status(404).send(err);
        
        res.status(200).json(dbs);
    });
});

module.exports = router;