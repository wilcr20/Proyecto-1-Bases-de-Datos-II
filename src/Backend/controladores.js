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

    });
};

exports.usarDB = function(rRequest, rResponse) {
    logica.usarDB(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();

    });
};

exports.mostrarTablas = function(rRequest, rResponse) {
    logica.mostrarTablas(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();

    });
};

exports.obtenerEsquemas = function(rRequest, rResponse) {
    logica.obtenerEsquemas(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        //      console.log("DATA RESUELTA de obtenerEsquemas: ", data);

    });
};

exports.crearEsquema = function(rRequest, rResponse) {
    logica.crearEsquema(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();

    });
};

exports.obtenerEsquemaTabla = function(rRequest, rResponse) {
    logica.obtenerEsquemaTabla(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        //console.log("DATA RESUELTA de obtenerEsquemaTabla: ", data);

    });
};

exports.hacerProcedimiento = function(rRequest, rResponse) {
    logica.hacerProcedimiento(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        //    console.log("DATA RESUELTA de hacerProc: ", data);

    });
};

exports.ejecutarProcedimiento = function(rRequest, rResponse) {
    logica.ejecutarProcedimiento(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        console.log("DATA RESUELTA de ejecutarProcedimiento: ", data);

    });
};

exports.obtenerParametros = function(rRequest, rResponse) {
    logica.obtenerParametros(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        // console.log("DATA RESUELTA de obtenerParametros: ", data);

    });
};

exports.obtenerPrimaryKey = function(rRequest, rResponse) {
    logica.obtenerPrimaryKey(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        console.log("DATA RESUELTA de obtenerPrimaryKey: ", data);

    });
};