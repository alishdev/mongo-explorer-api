// app/routes/document/index.js

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
 * Document API
 ****************************************************************/

/**
 * @swagger
 * /api/db/{dbname}/collection/{colname}/doc:
 *   get:
 *     tags:
 *       - Documents
 *     description: Returns an array of documents in selected collection
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
 *         description: array of documents in collection
 *         schema:
 *          type: array
 *          items:
 *              type: object
 */
router.get('/:dbname/collection/{colname}/doc', function(req, res) {
    database.all(req.connectionString, function(err, dbs){
        if (err)
            res.status(404).send(err);
        
        res.status(200).json(dbs);
    });
});
