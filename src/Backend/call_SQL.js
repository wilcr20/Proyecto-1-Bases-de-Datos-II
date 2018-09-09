var config = require('./proc_SQL');
var Connection = require('tedious').Connection;


// archivo con las configuraciones para realiazr las llamsdas a la base de datos
var connection;


////////////////////////////////////////////////////////////// Funcion para realizar llamda usando un query string
exports.executeRequest = function(request, callback) {
    'use strict';
    var res = [],
        connection = new Connection(config.config);

    connection.on('connect', function(err) {
        if (err) {
            callback({
                success: false,
                data: err.message,
                message: err.code
            });
            return;
        }
        request.on('row', function(columns) {
            var row = {};
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    row[column.metadata.colName] = column.value;

                }
            });
            res.push(row);

        });

        request.on('doneProc', function(rowCount, more, returnStatus, rows) {
            //console.log(rowCount + ' rows returned');
            callback({
                success: true,
                data: res,
                message: 200
            });

        });

        request.on('returnValue', function(parameterName, value, metadata) {
            connection.close();
            console.log("Entra a request return value");
            if (parameterName === 'iStatus' && value === 0) {
                callback({
                    success: true,
                    data: res,
                    message: 200
                });
            } else if (parameterName === 'iStatus') {
                callback({
                    success: false,
                    data: res,
                    message: 400
                });
            }
        });
        connection.execSql(request);
    });
};


////////////////////////////////////////////////////////////// Funcion para realizar llamda usando un procedimiento
exports.callProcedure = function(request, callback) {
    'use strict';
    var response = {};
    response.data = [],

        connection = new Connection(config.config);

    connection.on('connect', function(err) {
        if (err) {
            callback({
                success: false,
                data: err.message,
                error: "Hubo un problema con la conexión"
            });
        }

        request.on('row', function(columns) {
            var row = {};
            var flag = false;
            columns.forEach(function(column) {
                if (column.value === null) {
                    //console.log('NULL');
                } else {
                    if (column.metadata.colName == "") {
                        flag = true;
                    }
                    row[column.metadata.colName] = column.value;
                }
            });
            if (flag) {
                flag = false;
            } else {
                response.data.push(row);
            }

        });

        request.on('returnValue', function(parameterName, value, metadata) {
            connection.close();
            if (parameterName === 'success') {
                response.success = value;
                // callback({
                //     success: true,
                //     data: res
                // });
            } else if (parameterName === 'message') {
                response.message = value;
            } else {
                response.success = false;
            };
        });

        request.on('doneProc', function(rowCount, more, returnStatus, rows) {
            callback(
                response
            );
        });

        connection.callProcedure(request);
    });
};