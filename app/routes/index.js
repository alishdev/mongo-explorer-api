// app/routes/index.js

var routes = require('express').Router();

routes.get('/', (req, res) => {
  res.render('index');
});

const dbs = require('./db');
routes.use('/api/db', dbs);

module.exports = routes;
