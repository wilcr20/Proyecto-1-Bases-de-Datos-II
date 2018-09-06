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
    console.log("DATA BODY, ", data.body);
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