var Connection = require('tedious').Connection; // uso del modulo TEDIOUS para conexiones SQL
var proc_SQL = require('./proc_SQL');
let config = {};

exports.conectarServer = function conectarServer(data, callback) {
    //  console.log("data.body recibido: ", data.body.proyect);

    config = {
        userName: data.body.username,
        password: data.body.pasw,
        server: data.body.server,
        options: {
            // database: data.body.proyecto,
            driver: 'SQL Server Native Client 11.0',
            rowCollectionOnDone: true
        }
    };
    //Crea la conexión,
    var connection = new Connection(config);

    connection.on('connect', function(err) {
        if (err) {
            console.log("Error de conexion");
            callback(false)
        } else {
            console.log("Conectado corretamente xd ");
            callback(true)
        }
    });
}



exports.obtenerDb = function obtenerDb(callback) {
    var c = config;
    proc_SQL.obtenerBasesDeDatos(c, function(bases) {
        callback({
            success: true,
            data: bases.data,
            message: "Datos obtenidos con éxito.",
        })

    });
}

exports.usarDB = function usarDB(data, callback) {
    proc_SQL.usarDB(data.body.db, function(resultado) {
        if (resultado.success) {
            callback({
                succes: true,
                data: resultado.data,
                message: resultado.message,
                msgCode: 200,
            })

        } else {
            callback({
                success: false,
                data: resultado.message,
                message: resultado.message,
                msgCode: 400
            })
        }
    })

}


exports.mostrarTablas = function mostrarTablas(data, callback) {
    proc_SQL.mostrarTablas(data.body.db, function(resultado) {
        if (resultado.success) {
            callback({
                succes: true,
                data: resultado.data,
                message: resultado.message,
                msgCode: 200,
            })

        } else {
            callback({
                success: false,
                data: resultado.message,
                message: resultado.message,
                msgCode: 400
            })
        }
    })

}

exports.obtenerEsquemas = function obtenerEsquemas(data, callback) {
    proc_SQL.obtenerEsquemas(data.body.db, function(resultado) {
        if (resultado.success) {
            callback({
                succes: true,
                data: resultado.data,
                message: resultado.message,
                msgCode: 200,
            })

        } else {
            callback({
                success: false,
                data: resultado.message,
                message: resultado.message,
                msgCode: 400
            })
        }
    })
}
exports.crearEsquema = function crearEsquema(data, callback) {
    proc_SQL.crearEsquema(data.body.db, data.body.nombre, function(resultado) {
        if (resultado.success) {
            callback({
                succes: true,
                data: resultado.data,
                message: resultado.message,
                msgCode: 200,
            })

        } else {
            callback({
                success: false,
                data: resultado.message,
                message: resultado.message,
                msgCode: 400
            })
        }
    })

}

exports.obtenerEsquemaTabla = function obtenerEsquemaTabla(data, callback) {
    proc_SQL.obtenerEsquemaTabla(data.body.db, data.body.nombreT, function(resultado) {
        if (resultado.success) {
            callback({
                succes: true,
                data: resultado.data,
                message: resultado.message,
                msgCode: 200,
            })

        } else {
            callback({
                success: false,
                data: resultado.message,
                message: resultado.message,
                msgCode: 400
            })
        }
    })
}

exports.hacerProcedimiento = function hacerProcedimiento(data, callback) {
    // se pide la bd, el tipo(insert,delete..),el nombre tabla, el esquema tabla y esquema procedimiento
    proc_SQL.hacerProcedimiento(data.body.db, data.body.tipo, data.body.prefijo, data.body.nombreT, data.body.nombreET, data.body.nombreEP, function(resultado) {
        console.log("RESULTA HACER PROC: ", resultado);
        // esto es para seguir el siguiente formato: EXECUTE genera_insertar 'GA','Personas2','test','autogeneracion'
        if (resultado.success) {
            callback({
                succes: true,
                data: resultado.data,
                message: resultado.message,
                msgCode: 200,
            })

        } else {
            callback({
                success: false,
                data: resultado.message,
                message: resultado.message,
                msgCode: 400
            })
        }
    })

}


exports.ejecutarProcedimiento = function ejecutarProcedimiento(data, callback) {
    console.log(data.body);
    // ademas de pedir los atributos para la ejecucion del procedimiento
    proc_SQL.ejecutarProcedimiento(data.body.db, data.body.nombreEP, data.body.prefijo, data.body.tipo, data.body.nombreT, data.body.data, function(resultado) {
        // y seguidamente hacer este: EXEC autogeneracion.GA_Insert_Personas2 207730941,'Marco','Esquivel','Vargas'
        console.log("EjecutarProcedimiento  ", resultado);
        if (resultado.success) {
            callback({
                succes: true,
                data: resultado.data,
                message: resultado.message,
                msgCode: 200,
            })

        } else {
            callback({
                success: false,
                data: resultado.message,
                message: resultado.message,
                msgCode: 400
            })
        }
    })
}

exports.obtenerParametros = function obtenerParametros(data, callback) {
    console.log("BODY DE OBT PARA ", data.body);
    // ademas de pedir los atributos para la ejecucion del procedimiento
    proc_SQL.obtenerParametros(data.body.db, data.body.nombreT, data.body.nombreET, function(resultado) {
        // y seguidamente hacer este: EXEC autogeneracion.GA_Insert_Personas2 207730941,'Marco','Esquivel','Vargas'
        console.log("obtenerParametros  ", resultado);
        if (resultado.success) {
            callback({
                succes: true,
                data: resultado.data,
                message: resultado.message,
                msgCode: 200,
            })

        } else {
            callback({
                success: false,
                data: resultado.message,
                message: resultado.message,
                msgCode: 400
            })
        }
    })

}