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
var cors = require('cors');


app.use(session({secret: 'supernova', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/desktop", express.static(__dirname + '/../front-end'));
app.use("/phone", express.static(__dirname + '/../front-end/phone'));
app.use(cors());


//this listens to all socket events from socket.js on connection
var server = app.listen(port);
var io = require('socket.io')(server);
io.on('connection', function(socket) {

  socket.on('transaction', function(transaction) {
    io.sockets.emit('transaction', {
      transaction: transaction
    })
  })

});

//Use passport for authentication and store logged in users in sessions
app.use(passport.initialize());
app.use(passport.session());

require('./apiRoutes')(app, express);

console.log('We are now listening at ' + port);

console.log(__dirname + '../front-end');
exports = module.exports = app;
