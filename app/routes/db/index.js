// app/routes/db/index.js

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


/**************************************************************** 
 * Database API
 ****************************************************************/

/**
 * @swagger
 * /api/db/{dbname}:
 *   get:
 *     tags:
 *       - Databases
 *     description: Returns a single db
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
 *         description: A single database
 *         schema:
 *           $ref: '#definitions/Database'
 */
router.get('/:dbname', function(req, res) {    
    database.get(req.connectionString, req.params.dbname, function(err, db){
        if (err)
            res.status(404).send(err);
        else
            res.status(200).json(db);
    });
});

/**
 * @swagger
 * /api/db/:
 *   get:
 *     tags:
 *       - Databases
 *     description: Returns names of all databases
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: array of database names
 *         schema:
 *          type: array
 *          items:
 *              type: string
 */
router.get('/', function(req, res) {
    database.all(req.connectionString, function(err, dbs){
        if (err)
            res.status(404).send(err);
        else
            res.status(200).json(dbs);
    });
});

module.exports = router;