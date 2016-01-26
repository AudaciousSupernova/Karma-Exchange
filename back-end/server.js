var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('./Auth/passport.facebook.js');
var port = process.env.PORT || 3000;
var mainController = require('./db/dbControllers/mainController')
var session = require('express-session');

// example user obj
// var userObj = {
// 	name: "Bobo",
// 	password: "thisIsASaltyHash",
// 	email: "bob@bob.bobob",
// 	karma: 8080,
// 	facebookKey: "bobobobob"
// }
// mainController.addUser(userObj)
// mainController.findUser(name, saltedAndHashedPassword)
// mainController.findUserById(userId)
// mainController.deleteUser(userId)
// mainController.updateKarma(userId, newKarma)


// var sampleTransaction = {
// 	user_id: 2,
// 	target_id: 1,
// 	type: "sell",
// 	numberShares: 5,
// 	karma: 400
// }

// mainController.addTransaction(sampleTransaction)
// mainController.getTransactionHist(userId)

app.use(session({secret: 'supernova', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../front-end'));

app.listen(port);

app.use(passport.initialize());
app.use(passport.session());

require('./apiRoutes')(app, express);

console.log('We are now listening at ' + port);

console.log(__dirname + '../front-end');
exports = module.exports = app;
