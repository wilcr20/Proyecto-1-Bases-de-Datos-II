var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var call_SQL = require('./call_SQL.js');

exports.obtenerBasesDeDatos = function obtenerBasesDeDatos(data, callback) {
    exports.config = data;
    var request = new Request("SELECT name,database_id,create_date  FROM sys.databases where database_id >4;", function(err) {
        if (err) {
            callback({
                success: false,
                data: err,
                error: request.error,
                title: 'Error',
                message: 'Error al obtener información',
                type: 'error'
            });
        }
    });
    //console.log("callback: ", callback);
    call_SQL.executeRequest(request, callback)

}


exports.usarDB = function usarDB(data, callback) {
    console.log("use " + data + ";");
    var request = new Request("use " + data + ";", function(err) {
        if (err) {
            callback({
                success: false,
                data: err,
                error: request.error,
                title: 'Error',
                message: 'Error al obtener información',
                type: 'error'
            });
        }
    });
    //console.log("callback: ", callback);
    call_SQL.executeRequest(request, callback)
}


exports.mostrarTablas = function mostrarTablas(data, callback) {
    var request = new Request("use " + data + "; SELECT TABLE_NAME  FROM information_schema.TABLES;", function(err) {
        if (err) {
            callback({
                success: false,
                data: err,
                error: request.error, 
                title: 'Error',
                message: 'Error al obtener información',
                type: 'error'
            });
        }
    });
    //console.log("callback: ", callback);
    call_SQL.executeRequest(request, callback)
}

exports.obtenerEsquemas = function obtenerEsquemas(data, callback) {
    var request = new Request("use " + data + "; select DISTINCT TABLE_SCHEMA from INFORMATION_SCHEMA.COLUMNS;", function(err) {
        if (err) {
            callback({
                success: false,
                data: err,
                error: request.error, 
                title: 'Error',
                message: 'Error al obtener información',
                type: 'error'
            });
        }
    });
    //console.log("callback: ", callback);
    call_SQL.executeRequest(request, callback)
}


exports.crearEsquema = function crearEsquema(db,nombre, callback) {
    var request = new Request("use " + db+ "; create schema "+ nombre+ ";" , function(err) {
        if (err) {
            callback({
                success: false,
                data: err,
                error: request.error, 
                title: 'Error',
                message: 'Error al obtener información',
                type: 'error'
            });
        }
    });
    //console.log("callback: ", callback);
    call_SQL.executeRequest(request, callback)
}