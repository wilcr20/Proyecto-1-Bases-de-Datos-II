var logica = require('./logica');



exports.conectarServer = function(rRequest, rResponse) {
    logica.conectarServer(rRequest, function(data) {
        rResponse.send(data);
        rResponse.end();
        console.log("DATA RESUELTA: ", data);

    });
};