var logica = require('./logica');



exports.conectarServer = function(rRequest, rResponse) {
    logica.conectarServer(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();

    });
};

exports.obtenerDb = function(rRequest, rResponse) {
    logica.obtenerDb(function(data) {
        rResponse.send(data);
        rResponse.end();
        console.log("DATA RESUELTA de obtenerdb: ", data);

    });
};

exports.usarDB = function(rRequest, rResponse) {
    logica.usarDB(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        console.log("DATA RESUELTA de usarDb: ", data);

    });
};

exports.mostrarTablas = function(rRequest, rResponse) {
    logica.mostrarTablas(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        console.log("DATA RESUELTA de mostrarTablas: ", data);

    });
};

exports.obtenerEsquemas = function(rRequest, rResponse) {
    logica.obtenerEsquemas(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        console.log("DATA RESUELTA de obtenerEsquemas: ", data);

    });
};

exports.crearEsquema = function(rRequest, rResponse) {
    logica.crearEsquema(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        console.log("DATA RESUELTA de crearEsquema: ", data);

    });
};