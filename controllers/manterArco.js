'use strict';

const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {
    io.on('ARCO', function (ID_ARCO) {
        buscarArco(io, ID_ARCO)
    })
});

function buscarArco(io, ID) {
    var msg = 'ARCO' + ID;
    var sqlQry = `SELECT 
    a.ID, a.SITUACAO, a.ID_LIDER, a.DATA_HORA, a.CODIGO_EQUIPE, t.NOME AS NOME_TEMATICA, t.DESCRICAO AS DESCRICAO_TEMATICA
FROM
    ARCO AS a
        INNER JOIN
    TEMATICA AS t ON a.ID_TEMATICA = t.ID
        INNER JOIN
    EQUIPE AS e ON a.CODIGO_EQUIPE = e.CODIGO WHERE a.ID = ${ID}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            io.emit(msg, results[0]);
            io.broadcast.emit(msg, results[0]);
        }
    });
}


exports.buscarMeusArcos = ('/buscarMeusArcos/:ID_USUARIO', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO

    var sqlQry = `SELECT 
    a.ID, a.SITUACAO, a.ID_LIDER, a.DATA_HORA, t.NOME AS NOME_TEMATICA, t.DESCRICAO AS DESCRICAO_TEMATICA
FROM
    ARCO AS a
        INNER JOIN
    TEMATICA AS t ON a.ID_TEMATICA = t.ID
        INNER JOIN
    EQUIPE AS e ON a.CODIGO_EQUIPE= e.CODIGO WHERE e.ID_USUARIO = ${ID_USUARIO} AND e.SITUACAO = 2 OR a.ID_LIDER = ${ID_USUARIO} AND e.SITUACAO = 2 GROUP BY a.ID ORDER BY a.ID DESC`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(203).send(results);
        }
    });

})
exports.novoArco = ('/novoArco/:ID_LIDER/:ID_TEMATICA', (req, res) => {

    const ID_LIDER = req.params.ID_LIDER;
    const ID_TEMATICA = req.params.ID_TEMATICA;
    var DATA_HORA = require('./util').dataAtual();

    //SITUACAO 1 = EM DESENVOLVIMENTO
    //SITUACAO 2 = FINALIZADO
    //SITUACAO 3 = BLOQUEADO
    var sqlQry1 = `INSERT INTO ARCO (ID_TEMATICA, ID_LIDER, DATA_HORA, SITUACAO) 
    VALUES (${ID_TEMATICA},${ID_LIDER},'${DATA_HORA}',1)`;

    execute.executeSQL(sqlQry1, function (results) {

        if (results['insertId'] > 0) {
            inserirEtapas(results['insertId'], ID_LIDER, res);
        } else {
            res.status(203).send(results);
        }
    });
});


function inserirEtapas(ID_ARCO, ID_LIDER, res) {

    //SITUACAO 1 = EM DESENVOLVIMENTO
    //SITUACAO 2 = FINALIZADO
    //SITUACAO 3 = BLOQUEADO

    var sqlQry2 = `INSERT INTO ETAPA (ID_ARCO, NOME, DESCRICAO_LIDER, DESCRICAO_MENBRO, SITUACAO, CODIGO) VALUES 
    (${ID_ARCO},'OBSERVAÇÃO DA REALIDADE','-','-',1,1),
    (${ID_ARCO},'PONTOS CHAVES','-','-',3,2),
    (${ID_ARCO},'TEORIZAÇÃO','-','-',3,3),
    (${ID_ARCO},'HIPÓTESES DE SOLUÇÃO','-','-',3,4),
    (${ID_ARCO},'APLICAÇÃO A REALIDADE','-','-',3,5)`;

    execute.executeSQL(sqlQry2, function (results) {
        if (results['insertId'] > 0) {
            gerarCodigoEquipe(ID_ARCO, ID_LIDER, res)
        } else {
            res.status(203).send(results);
        }

    });
}

function gerarCodigoEquipe(ID_ARCO, ID_LIDER, res) {

    var randomstring = Math.random().toString(36).slice(-3);
    var CODIGO_EQUIPE = ID_ARCO + randomstring;

    var sqlQry1 = `UPDATE ARCO SET CODIGO_EQUIPE = '${CODIGO_EQUIPE}' WHERE ID = ${ID_ARCO}`;

    execute.executeSQL(sqlQry1, function (results) {

        if (results['affectedRows'] > 0) {
            inserirliderNaEquipe(CODIGO_EQUIPE, ID_LIDER, ID_ARCO, res)
        } else {
            res.status(203).send(results);
        }
    });

}

function inserirliderNaEquipe(CODIGO_EQUIPE, ID_USUARIO, ID_ARCO, res) {

    //SITUACAO 1 = AGUARDANDO
    //SITUACAO 2 = APROVADO

    var sqlQry = `INSERT INTO EQUIPE (CODIGO, ID_USUARIO, SITUACAO) VALUES ('${CODIGO_EQUIPE}',${ID_USUARIO}, 2)`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            res.status(200).send({
                ID_ARCO: ID_ARCO
            });
        } else {
            res.status(203).send(results);
        }

    });

}

exports.buscarTodosArcos = ('buscarTodosArcos', (req, res) => {

    var sqlQry = `SELECT 
    o.ID, o.ID_ETAPA, e.NOME AS NOME_ETAPA, o.ID_USUARIO, o.DATA_HORA, o.TEXTO, a.ID_LIDER, a.ID AS ID_ARCO
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
    INNER JOIN ARCO AS a ON e.ID_ARCO = a.ID WHERE o.SITUACAO = 2`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(203).send(results);
        }
    });
})

