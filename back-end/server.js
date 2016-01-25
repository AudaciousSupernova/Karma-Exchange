var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('./Auth/passport.facebook.js');
var port = process.env.PORT || 3000;
var mainController = require('./db/dbControllers/mainController')

// example user obj
// var user = {
// 	name: "Bobo",
// 	password: "thisIsASaltyHashToo",
// 	email: "bob@bob.bobob",
// 	karma: 80808,
// 	facebookKey: "bobobobobob"
// }
// mainController.addUser(userObj)
// mainController.findUser(name, saltedAndHashedPassword)
// mainController.findUserById(userId)
// mainController.deleteUser(userId)


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
