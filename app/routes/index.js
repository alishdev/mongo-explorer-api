// app/routes/index.js

var routes = require('express').Router();

routes.get('/', (req, res) => {
  res.render('index');
});

const dbs = require('./db');
routes.use('/api/db', dbs);

console.log(routes);

const collections = require('./collection');
routes.use('/api/db/:dbName/collection', collections);

console.log(routes);

module.exports = routes;
