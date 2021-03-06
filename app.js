// Execcute code in strict mode. With strict mode, you cannot use undeclared variables.
'use strict';

// const variables
const port = 8080;

// Dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');


// MongoDB -------------------------------------------
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var monk = require('monk');
var db = monk('localhost:27017/Follow');
// var usersRouter = require('./routes/users');
// ^^-------------------------------------------------


// Router
var indexRouter = require('./routes/index');
var createTeamRouter = require('./routes/createteam');
var teamProfileRouter = require('./routes/teamprofile');
var loginRouter = require('./routes/login');
var createAccountRouter = require('./routes/createaccount');
var reviewsRouter = require('./routes/reviews');
var friendsRouter = require('./routes/friends');
var joinTeamRouter = require('./routes/jointeam');

// MySQL Connection
var mysqlConnection = require('./common/mysql-connection');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB -------------------------------------------
app.use(logger('dev'));
app.use(cookieParser());
app.use(function(req,res,next){
  req.db = db;
  next();
 });
 // app.use('/users', usersRouter);
// ^^-------------------------------------------------

// API path registration
app.use('/', loginRouter);
app.use('/index', indexRouter);
app.use('/teamprofile', teamProfileRouter);
app.use('/createteam', createTeamRouter);
app.use('/createaccount', createAccountRouter);
app.use('/reviews', reviewsRouter);
app.use('/friends', friendsRouter);
app.use('/jointeam', joinTeamRouter);

// Connect to MySQL
mysqlConnection.connection.connect();

module.exports = app;

var server = http.createServer(app);
server.listen(8080, function() {
  console.log('Gryffindor is listening on port 8080');
});

// TODO: close MySQL connection

// db.followCollection.update(
//   {
//     "userId": "4"
//   },
//   {
//     $push: {
//       "following": "4"
//     }
//   }
// )

// db.followCollection.find({userId: "1"}).size()