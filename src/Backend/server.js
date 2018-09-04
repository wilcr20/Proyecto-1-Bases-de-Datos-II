
const http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var ctrl = require('./controladores');  // llama los controladores

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
  next();
});



app.get('/conectarServer', ctrl.conectarServer);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Servidor corriendo en puerto 3000!! ;v');
});

