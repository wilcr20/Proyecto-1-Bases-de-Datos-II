var Connection = require('tedious').Connection; // uso del modulo TEDIOUS para conexiones SQL




exports.conectarServer = function conectarServer(data, callback) {

    console.log("DATA RECIBIDAS; ", data.body);

    var config = {
        userName: data.body.username,
        password: data.body.pasw,
        server: data.body.server
            /*,
               options: {
                 database: 'proyecto',
                 driver: 'SQL Server Native Client 11.0',
                 rowCollectionOnDone: true
             }*/
    };

    //Crea la conexión,
    var connection = new Connection(config);

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
            callback(false)
        } else {
            console.log("Conectado corretamente xd ");
            callback(true)
        }
    });
}