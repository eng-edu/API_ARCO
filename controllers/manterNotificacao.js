'use strict';
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {

    io.on('NOTIFICACAO', function (ID_USUARIO) {
        buscarNotificacao(io, ID_USUARIO)
    })

    io.on('NUM_NOTIFICACAO', function (ID_USUARIO) {
        buscarNumNotificacao(io, ID_USUARIO)
    })


});

function buscarNotificacao(io, ID_USUARIO) {
    var msg = 'NOTIFICACAO' + ID_USUARIO;
    var sqlQry = `SELECT * FROM NOTIFICACAO WHERE ID_USUARIO = ${ID_USUARIO} ORDER BY ID DESC LIMIT 10;`;
    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
    });
}


function buscarNumNotificacao(io, ID_USUARIO) {
    var msg = 'NUM_NOTIFICACAO' + ID_USUARIO;
    var sqlQry = `SELECT count(ID) AS NUM_NOTIFICACAO FROM NOTIFICACAO WHERE ID_USUARIO = ${ID_USUARIO} AND SITUACAO = 1;`;
    execute.executeSQL(sqlQry, function (results) {

        io.emit(msg, results[0]['NUM_NOTIFICACAO']);
        io.broadcast.emit(msg, results[0]['NUM_NOTIFICACAO']);

        if (results.length > 0) {
            execute.executeSQL(`UPDATE NOTIFICACAO SET SITUACAO = 2 WHERE ID_USUARIO = ${ID_USUARIO} AND SITUACAO = 1`, function (results) {
                if (results.length > 0) {
                    
                } 
            });
        } 
      
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

    
    //SITUACAO 1 = NOTIFICANDO
    //SITUACAO 2 = NOTIFICADO


    var msg = 'NOTIFICACAO' + ID_USUARIO;
    var DATA_HORA = require('./util').dataAtual();
    var sqlQry = `INSERT INTO NOTIFICACAO (ID_USUARIO, ID_ARCO, TEXTO, DATA_HORA, SITUACAO) VALUES (${ID_USUARIO}, ${ID_ARCO}, '${TEXTO}', '${DATA_HORA}', 1)`;
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



