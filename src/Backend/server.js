const http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var ctrl = require('./controladores'); // llama los controladores

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
    next();
});



app.put('/conectarServer', ctrl.conectarServer);
app.get('/obtenerDB', ctrl.obtenerDb);
app.put('/usarDB', ctrl.usarDB);
app.put('/mostrarTablas', ctrl.mostrarTablas);
app.put('/obtenerEsquemas', ctrl.obtenerEsquemas);
app.put('/crearEsquema', ctrl.crearEsquema);
app.put('/obtenerEsquemaTabla', ctrl.obtenerEsquemaTabla);
app.put('/hacerProcedimiento', ctrl.hacerProcedimiento);
app.put('/ejecutarProcedimiento', ctrl.ejecutarProcedimiento);
app.put('/obtenerParametros', ctrl.obtenerParametros);
app.put('/obtenerPrimaryKey', ctrl.obtenerPrimaryKey);




app.get('/', function(req, res) {
    res.send('Servidor de NodeJs para proyecto Bases de datos II!');
});

app.listen(3000, function() {
    console.log('Servidor corriendo en puerto 3000!! ;v');
});