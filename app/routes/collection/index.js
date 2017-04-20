// app/routes/collection/index.js

// route file for MongoDB databases
var logger = require('winston');

let router = require('express').Router(),
    database = require('../../models/db/db');

/**************************************************************** 
 * Swagger schema definitions
*****************************************************************/

//-------  Database object
/**
 * @swagger
 * definitions:
 *   Database:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       collections:
 *         type: array
 *         items:
 *           type: string
 */

//--------  Collection object
/**
 * @swagger
 * definitions:
 *   Collection:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       docsCount:
 *         type: number
 */

/**************************************************************** 
 * Collection API
 ****************************************************************/

/**
 * @swagger
 * /api/db/{dbname}/collection/{colname}:
 *   get:
 *     tags:
 *       - Collections
 *     description: Returns a single collection information
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: dbname
 *         description: Database name
 *         in: path
 *         required: true
 *         type: string
 *       - name: colname
 *         description: Collection name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single collection in database
 *         schema:
 *           $ref: '#definitions/Collection'
 */
router.get('/:dbname/collection/:colname', function(req, res) {    
    database.get(req.params.dbname, function(err, db){
        if (err)
            res.status(404).send(err);
        res.status(200).json(db);
    });
});

/**
 * @swagger
 * /api/db/{dbname}/collection:
 *   get:
 *     tags:
 *       - Collections
 *     description: Returns names of all collections in database
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: dbname
 *         description: Database name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: array of collection names
 *         schema:
 *          type: array
 *          items:
 *              type: string
 */
router.get('/:dbname/collection', function(req, res) {
    database.all(req.connectionString, function(err, dbs){
        if (err)
            res.status(404).send(err);
        
        res.status(200).json(dbs);
    });
});
