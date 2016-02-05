var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('./Auth/passport.facebook.js');
var port = process.env.PORT || 3000;
var mainController = require('./db/dbControllers/mainController')
var session = require('express-session');
var transactionUtil = require('./utils/transactionUtil');
var scoresUtil = require('./utils/scoresUtil');
var socket = require('./socket.js');
//adding in socket.io dependency


// var transactionQueueController = require('./db/dbControllers/transactionQueue')
//<h3>Main Controller examples</h3>
//this is just a series of examples for the main controller
//eventually theses examples should probably be put somewhere other than server.js

// example user obj
// var userObj = {
//  name: "Bobo",
//  password: "thisIsASaltyHash",
//  email: "bob@bob.bobob",
//  karma: 8080,
//  facebookKey: "bobobobob"
//  profile_photo: "https://s3.amazonaws.com/uifaces/faces/twitter/pifagor/128.jpg"
// }
// mainController.addUser(userObj, callback)
// mainController.findUser(name, saltedAndHashedPassword)
// mainController.findUserById('693c0d7f-f2ec-4bf2-a7a8-d8a0d0913ea9', console.log)
// mainController.deleteUser(userId)
// mainController.updateKarma(userId, newKarma)
// mainController.countUsers(console.log)
// mainController.getAllUsers(console.log)

// var sampleTransaction = {
//  user_id: 3,
//  target_id: 5,
//  type: "sell",
//  numberShares: 5,
//  karma: 400
// }

// transactionUtil.makeTransaction(sampleTransaction)
// mainController.addTransaction(sampleTransaction)
// mainController.getTransactionHist(5, console.log)

// var sampleScoreObj = {
//  user_id: 243,
//  type: "social-investment",
//  score: 95
// }

// mainController.addScore(sampleScoreObj, console.log)
// mainController.getScores(243, console.log)


app.use(session({secret: 'supernova', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../front-end'));

//this listens to all socket events from socket.js on connection


var server = app.listen(port);
var io = require('socket.io')(server);
io.on('connection', socket);

app.use(passport.initialize());
app.use(passport.session());

require('./apiRoutes')(app, express);

console.log('We are now listening at ' + port);

console.log(__dirname + '../front-end');
exports = module.exports = app;
