

var Connection = require('tedious').Connection; // uso del modulo TEDIOUS para conexiones SQL
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

exports.conexionDB = function (username, password, server){

  var config = {
    userName: 'Wilfred',
    password: '123456789',
    server: 'localhost' /*,
    options: {
      database: 'proyecto',
      driver: 'SQL Server Native Client 11.0',
      rowCollectionOnDone: true
  }*/
};

//Crea la conexión,
var connection = new Connection(config);

connection.on('connect', function (err) {
    if (err) {
        console.log(err);

        localStorage.setItem("exito",false);
    }
    else{
      console.log("Conectado corretamente xd ", config);
      localStorage.setItem("exito",false);
    }
});


}

