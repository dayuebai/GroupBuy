'use strict';

var express = require('express');

var mysqlConnection = require('../common/mysql-connection.js');
var router = express.Router();

var postHandler = function(req, res) {
  console.log('in create-account postHandler');

  const reqBody = req.body;

  executeTransaction(reqBody, res);
  
}

function executeTransaction(reqBody, res) {
  mysqlConnection.connection.beginTransaction(function(err) {
    if (err) { 
      throw err; 
    }
    console.log(reqBody);
    console.log(reqBody.email);
    console.log(reqBody.password);
    const checkUserQuery = `select userId from Users where email="${reqBody.email}" and password="${reqBody.password}"`;


    mysqlConnection.connection.query(checkUserQuery, function (error, results, fields) {

      if (error) {
        res.status(500).json({ message : "failure"});
        return mysqlConnection.connection.rollback(function() {
          throw error;
        });
      }
      
      if (results.length == 0){
          console.log("invalid login info");
          res.status(200).json({info: "password doesn't match the email"});
          return;

      } else {
        console.log("valid info");
        var loginUserId = results[0]["userId"];
        console.log(loginUserId);
        res.status(200).json({info: "success", userId: loginUserId});
        return;
      }


    });

  });
};
 
const getHandler = function(req, res) {
    res.render('login');
}

router.post('/', postHandler);
router.get('/', getHandler);


module.exports = router;
