
var connect = require('./connectSQL');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');


exports.conectarServer = function conectarServer(data, callback) {
  console.log("DATA: ", data);
  localStorage.clear();
  connect.conexionDB(data.body.username, data.body.password, data.body.server);

  if(localStorage.getItem("exito") === true){
    callback({
      success: true,
      message: 'Conectado',
      msgCode: 200
  })

  }else{
    callback({
      success: false,
      message: 'No conectado',
      msgCode: 400
  })
  }




  /*

  sqlConect.postpreRegFuncionario(datos.body.username, datos.body.password, datos.body.server, function(resultado) {
      if (resultado.success) {
          callback({
              success: true,
              message: resultado.message,
              msgCode: 200
          })
      } else {
          callback({
              success: false,
              message: resultado.message,
              msgCode: 400
          })
      }
  });
  */
}
