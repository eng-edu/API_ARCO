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
    var sqlQry = `SELECT 
    o.ID, o.ID_ETAPA, e.NOME AS NOME_ETAPA, o.ID_USUARIO, o.DATA_HORA, o.TEXTO
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
WHERE
    ID_ETAPA = ${ID_ETAPA} AND o.SITUACAO = 1;`;


    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
    });
}

exports.atualizarOpiniao = ('/atualizarOpiniao/:ID_USUARIO/:ID_ETAPA/:TEXTO', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO;
    const ID_ETAPA = req.params.ID_ETAPA;
    const TEXTO = req.params.TEXTO;
    var DATA_HORA = require('./util').dataAtual();

    var sqlQry = `UPDATE OPINIAO SET DATA_HORA = '${DATA_HORA}', TEXTO = '${TEXTO}' WHERE ID_ETAPA = ${ID_ETAPA} AND ID_USUARIO = ${ID_USUARIO}`;

    execute.executeSQL(sqlQry, function (results) {
        if (results['affectedRows'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(203).send(results);
        }

    });
});

exports.buscarOpiniao2 = ('/buscarOpiniao/:ID_USUARIO/:ID_ETAPA', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO;
    const ID_ETAPA = req.params.ID_ETAPA;

    var sqlQry = `SELECT  o.TEXTO
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
WHERE
    ID_ETAPA = ${ID_ETAPA} AND o.SITUACAO = 1 AND o.ID_USUARIO = ${ID_USUARIO};`;


    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results[0]);
        } else {

            inserirOpiniao(ID_USUARIO, ID_ETAPA, res)
        }

    });
});


function inserirOpiniao(ID_USUARIO, ID_ETAPA, res) {

    var DATA_HORA = require('./util').dataAtual();

    //SITUACAO 1 = EM DESENVOLVIMENTO
    //SITUACAO 2 = FINALIZADO

    var sqlQry = `INSERT INTO OPINIAO(ID_ETAPA, ID_USUARIO, SITUACAO, DATA_HORA, TEXTO) VALUES (${ID_ETAPA}, ${ID_USUARIO}, '1', '${DATA_HORA}', 'Desenvovlda seu tetxo aqui!')`;

    execute.executeSQL(sqlQry, function (results) {
        if (results['insertId'] > 0) {
            buscarOpiniao3(ID_USUARIO, ID_ETAPA, res)
        } else {
            res.status(203).send(results);
        }

    })
}

function buscarOpiniao3(ID_USUARIO, ID_ETAPA, res) {
    var sqlQry = `SELECT  o.TEXTO
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
WHERE
    ID_ETAPA = ${ID_ETAPA} AND o.SITUACAO = 1 AND o.ID_USUARIO = ${ID_USUARIO};`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results[0]);
        } else {
            res.status(203).send(results)
        }

    });
}