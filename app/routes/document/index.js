// app/routes/document/index.js
// route file for document endpoints

var logger = require('winston');

let router = require('express').Router({ mergeParams: true }),
    document = require('../../models/document/document');

/**************************************************************** 
 * Swagger schema definitions
*****************************************************************/


/**************************************************************** 
 * Document API
 ****************************************************************/

/**
 * @swagger
 * /api/db/{dbname}/collection/{colname}/doc/{docid}:
 *   get:
 *     tags:
 *       - Documents
 *     description: Returns a specific documents by its id
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
 *       - name: docid
 *         description: Document _id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: document contents
 *         schema:
 *          type: object
 */
router.get('/:docid', function(req, res) {
    let collName = req.params.collName;
    let docid = req.params.docid;
    logger.info(`get doc coll: ${collName}, docid = ${docid}`);
    document.get(req.connectionString, collName, docid, function(err, doc){
        if (err)
            res.status(404).send(err);
        else
            res.status(200).json(doc);
    });
});

module.exports = router;