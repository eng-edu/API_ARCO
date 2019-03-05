'use strict';

const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {
    io.on('ARCO', function (ID_ARCO) {
        buscarArco(io,ID_ARCO)
    })

    io.on('ETAPA', function (ID_ARCO) {
        buscarEtapa(io,ID_ARCO)
    })

    io.on('OPINIAO', function (ID_ARCO) {
        buscarOpiniao(io,ID_ARCO)
    })

});

function buscarArco(io, ID) {
    var msg = 'ARCO' + ID;
    var sqlQry = `SELECT 
    a.ID, a.STATUS, a.ID_LIDER, a.DATA_HORA, e.NOME AS NOME_EQUIPE, t.NOME AS NOME_TEMATICA, t.DESCRICAO AS DESCRICAO_TEMATICA
FROM
    ARCO AS a
        INNER JOIN
    TEMATICA AS t ON a.ID_TEMATICA = t.ID
        INNER JOIN
    EQUIPE AS e ON a.ID = e.ID_ARCO WHERE a.ID = ${ID}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            io.emit(msg, results[0]);
            io.broadcast.emit(msg, results[0]);
        }
    });
}

function buscarEtapa(io, ID_ARCO) {
    var msg = 'ETAPA' + ID_ARCO;
    var sqlQry = `SELECT e.ID, e.STATUS, e.CODIGO FROM ETAPA AS e INNER JOIN TEMATICA AS t ON t.ID =  WHERE ID_ARCO = ${ID_ARCO}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            io.emit(msg, results);
            io.broadcast.emit(msg, results);
        }
    });
}

function buscarOpiniao(io, ID_ARCO) {
    var msg = 'ETAPA' + ID_ARCO;
    var sqlQry = `SELECT ID, STATUS, CODIGO FROM ETAPA WHERE ID_ARCO = ${ID_ARCO}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            io.emit(msg, results);
            io.broadcast.emit(msg, results);
        }
    });
}

exports.buscarMeusArcos = ('/buscarMeusArcos/:ID_USUARIO', (req, res) => {
    
    const ID_USUARIO = req.params.ID_USUARIO
    
    var sqlQry = `SELECT 
    a.ID, a.SITUACAO, a.ID_LIDER, a.DATA_HORA, e.NOME AS NOME_EQUIPE, t.NOME AS NOME_TEMATICA, t.DESCRICAO AS DESCRICAO_TEMATICA
FROM
    ARCO AS a
        INNER JOIN
    TEMATICA AS t ON a.ID_TEMATICA = t.ID
        INNER JOIN
    EQUIPE AS e ON a.ID = e.ID_ARCO WHERE e.ID_USUARIO = ${ID_USUARIO} OR a.ID_LIDER = ${ID_USUARIO} GROUP BY a.ID`;

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
    var sqlQry1 = `INSERT INTO ARCO (ID_TEMATICA, ID_LIDER, DATA_HORA, SITUACAO) 
    VALUES (${ID_TEMATICA},${ID_LIDER},'${DATA_HORA}',1)`;

    execute.executeSQL(sqlQry1, function (results) {

        if (results['insertId'] > 0) {
            inserirEtapas(results['insertId'],  res);
        } else {
            res.status(203).send(results);
        }
    });
});
function inserirEtapas(ID_ARCO, res) {
    
    //SITUACAO 1 = EM DESENVOLVIMENTO
    //SITUACAO 2 = FINALIZADO

    var sqlQry2 = `INSERT INTO ETAPA (ID_ARCO, NOME, DESCRICAO, SITUACAO, CODIGO) VALUES 
    (${ID_ARCO},'OBSERVAÇÃO DA REALIDADE',' ----- ',1,1),
    (${ID_ARCO},'PONTOS CHAVES',' ----- ',1,2),
    (${ID_ARCO},'TEORIZAÇÃO',' ----- ',1,3),
    (${ID_ARCO},'HIPÓTESES DE SOLUÇÃO',' ----- ',1,4),
    (${ID_ARCO},'APLICAÇÃO A REALIDADE',' ----- ',1,5)`;

    execute.executeSQL(sqlQry2, function (results) {
        if (results['insertId'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(203).send(results);
        }

    });
}


