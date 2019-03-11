'use strict';
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {

    io.on('NOTIFICACAO', function (ID_USUARIO) {
        buscarNotificacao(io, ID_USUARIO)
    })

});

function buscarNotificacao(io, ID_USUARIO) {
    var msg = 'NOTIFICACAO' + ID_USUARIO;
    var sqlQry = `SELECT * FROM NOTIFICACAO WHERE ID_USUARIO = ${ID_USUARIO}`;
    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
    });
}

exports.buscar = ('/buscar/:ID_ARCO', (req, res) => {
    var sqlQry = `SELECT * FROM EQUIPE WHERE ID = '${req.params.ID}'`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }

    });

})

exports.inserirNotificacao = function (ID_USUARIO, ID_ARCO, TEXTO, res) {
    var msg = 'NOTIFICACAO' + ID_USUARIO;
    var DATA_HORA = require('./util').dataAtual();
    var sqlQry = `INSERT INTO NOTIFICACAO (ID_USUARIO, ID_ARCO, TEXTO, DATA_HORA) VALUES (${ID_USUARIO}, ${ID_ARCO}, '${TEXTO}', '${DATA_HORA}')`;
    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            res.status(200).send({
                ID_USUARIO: ID_USUARIO
            });
        } else {
            res.status(203).send(results);
        }

    });
}



