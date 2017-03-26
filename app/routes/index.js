var express = require('express');

module.exports = function(app) {
  'use strict';
  
  app.get('/', function(req, res){
    res.render('index');
  });
};