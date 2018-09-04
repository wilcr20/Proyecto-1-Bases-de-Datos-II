var logica= require('./logica');



exports.conectarServer = function(rRequest, rResponse) {
  logica.conectarServer(rRequest, function(data) {
      rResponse.end();
     console.log("data: ", data);
  });
};
