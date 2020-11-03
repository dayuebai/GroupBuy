'use strict';

var express = require('express');
var mysqlConnection = require('./../common/mysql-connection.js');
var router = express.Router();


var getHandler = function(req, res, next) {
  // mysqlConnection.connection.query('SELECT * from movies', function (error, results, fields) {
  //   if (error) 
  //     throw error;
  //   console.log('The result is: ', results);
  // });
  console.log("index api")
  res.render('index');
}

/* GET home page. */
router.get('/', getHandler);

module.exports = router;