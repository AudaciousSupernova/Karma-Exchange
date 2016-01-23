var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../front-end'));

app.listen(port);

console.log('We are now listening at ' + port);

console.log(__dirname + '../front-end');
exports = module.exports = app;
