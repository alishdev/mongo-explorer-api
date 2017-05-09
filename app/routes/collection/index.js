// app/routes/collection/index.js
// route file for Collection endpoints

var logger = require('winston');
let router = require('express').Router({ mergeParams: true }),
    collection = require('../../models/collection/collection');

/**************************************************************** 
 * Swagger schema definitions
*****************************************************************/

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
 *       size:
 *         type: number
 *       avgObjSize:
 *         type: number
 *       indexes:
 *          type: array
 *          items:
 *             type: string
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
router.get('/:colname', function(req, res) {    
    collection.get(req.connectionString, req.params.colname, function(err, coll){
        if (err)
            res.status(404).send(err);
        else
            res.status(200).json(coll);
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
router.get('/', function(req, res) {
    collection.all(req.connectionString, function(err, colls){
        if (err)
            res.status(404).send(err);
        else
            res.status(200).json(colls);
    });
});

module.exports = router;
