// app/routes/index.js

var routes = require('express').Router();

routes.get('/', (req, res) => {
  res.render('index');
});

const dbs = require('./db');
routes.use('/api/db', dbs);

const collections = require('./collection');
routes.use('/api/db/:dbName/collection', collections);

const documents = require('./document');
routes.use('/api/db/:dbName/collection/:collName/doc', documents);

console.log(routes);

module.exports = routes;
