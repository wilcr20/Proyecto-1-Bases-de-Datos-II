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
    var request = new Request("use " + data + "; select * from INFORMATION_SCHEMA.SCHEMATA;", function(err) {
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


exports.crearEsquema = function crearEsquema(db, nombre, callback) {
    var request = new Request("use " + db + ";  EXEC ('CREATE SCHEMA [" + nombre + "]');", function(err) {
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

exports.obtenerEsquemaTabla = function obtenerEsquemaTabla(db, nombreT, callback) {
    var request = new Request("use " + db + "; select TABLE_SCHEMA from INFORMATION_SCHEMA.TABLES where TABLE_CATALOG= '" + db + "' and Table_name= '" + nombreT + "' ;", function(err) {
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

exports.hacerProcedimiento = function hacerProcedimiento(db, tipo, prefijo, nombreT, nombreET, nombreEP, callback) {
    console.log("use " + db + "; EXEC genera_" + tipo + " '" + prefijo + "', '" + nombreT + "', '" + nombreET + "', '" + nombreEP + "' , '' ;");
    var request = new Request("use " + db + "; EXEC genera_" + tipo + " '" + prefijo + "', '" + nombreT + "', '" + nombreET + "', '" + nombreEP + "' , '' ;", function(err) {
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

exports.ejecutarProcedimiento = function ejecutarProcedimiento(db, nombreEP, prefijo, tipo, nombreT, parametros, callback) {
    var request = new Request("use " + db + ";EXEC " + nombreEP + "." + prefijo + "_" + tipo + "_" + nombreT + parametros + ";", function(err) {
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

exports.obtenerParametros = function obtenerParametros(db, nombreET, nombreT, callback) {
    console.log("use " + db + "; select distinct COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_CATALOG= '" + db + "' and table_schema= '" + nombreT + "' and table_name= '" + nombreET + "' ;");
    var request = new Request("use " + db + ";select distinct COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_CATALOG= '" + db + "' and table_schema= '" + nombreT + "' and table_name= '" + nombreET + "' ;", function(err) {
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