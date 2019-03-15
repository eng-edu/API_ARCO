'use strict';
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');


socket.on('connection', (io) => {
    io.on('OPINIAO', function (ID_ETAPA) {
        buscarOpiniao(io, ID_ETAPA)
    })

});

function buscarOpiniao(io, ID_ETAPA) {
    var msg = 'OPINIAO' + ID_ETAPA;
    var sqlQry = `SELECT * FROM OPINIAO WHERE ID_ETAPA = ${ID_ETAPA} AND e.SITUACAO = 1;`;
    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
    });
}

exports.novaOpiniao = ('/novaOpiniao/:ID_LIDER/:ID_TEMATICA', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO;
    const ID_ETAPA = req.params.ID_ETAPA;
    var DATA_HORA = require('./util').dataAtual();

    var sqlQry = `INSERT INTO OPINIAO(ID_ETAPA, ID_USUARIO, SITUACAO, DATA_HORA) VALUES (${ID_USUARIO}, ${ID_ETAPA}, '1', '${DATA_HORA}')`;
   
    execute.executeSQL(sqlQry, function (results) {
        if (results['insertId'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(203).send(results);
        }

    });
});
