'use strict';

const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {
    io.on('ARCO', function (ID_ARCO) {
        buscarEtapa(io, ID_ARCO)
    })
});

function buscarEtapa(io, ID_ARCO) {
    var msg = 'ETAPA' + ID_ARCO;
    var sqlQry = `SELECT 
    e.ID,
    e.NOME AS NOME_ETAPA,
    e.SITUACAO AS SITUACAO_ETAPA,
    e.CODIGO AS CODIGO_ETAPA,
    e.DESCRICAO_LIDER AS DESCRICAO_ETAPA_LIDER,
    e.DESCRICAO_MENBRO AS DESCRICAO_ETAPA_MENBRO,
    t.NOME AS NOME_TEMATICA,
    t.DESCRICAO AS DESCRICAO_TEMATICA
FROM
    ETAPA AS e
        INNER JOIN
    ARCO AS a ON e.ID_ARCO = a.ID
        INNER JOIN
    TEMATICA AS t ON a.ID_TEMATICA = t.ID
WHERE
    a.ID = ${ID_ARCO};`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            io.emit(msg, results);
            io.broadcast.emit(msg, results);
        }
    });
}

exports.buscarEtapa = ('/buscarEtapa/:ID_ETAPA', (req, res) => {
    var sqlQry = `SELECT 
    e.ID,
    e.NOME AS NOME_ETAPA,
    e.SITUACAO AS SITUACAO_ETAPA,
    e.CODIGO AS CODIGO_ETAPA,
    e.DESCRICAO_LIDER AS DESCRICAO_ETAPA_LIDER,
    e.DESCRICAO_MENBRO AS DESCRICAO_ETAPA_MENBRO,
    t.NOME AS NOME_TEMATICA,
    t.DESCRICAO AS DESCRICAO_TEMATICA
FROM
    ETAPA AS e
        INNER JOIN
    ARCO AS a ON e.ID_ARCO = a.ID
        INNER JOIN
    TEMATICA AS t ON t.ID = a.ID_TEMATICA
WHERE
    e.ID = ${req.params.ID_ETAPA};`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results[0]);
        } else {
            res.status(203).send(results);
        }

    });

})

exports.finalizarEtapa = ('/finalizarEtapa/:ID/:CODIGO', (req, res) => {

    var ID = req.params.ID
    var CODIGO = req.params.CODIGO

    execute.executeSQL(`SELECT * FROM OPINIAO WHERE ID_ETAPA = ${ID}`, function (results4) {
        if (results4.length > 0) {

            execute.executeSQL(`UPDATE OPINIAO SET SITUACAO = 2 WHERE ID_ETAPA = ${ID}`, function (results1) {
                if (results1['affectedRows'] > 0) {

                    execute.executeSQL(`UPDATE ETAPA SET SITUACAO = 2 WHERE ID = ${ID}`, function (results2) {
                        if (results2['affectedRows'] > 0) {

                            var proxID = parseInt(ID);
                            var proxCOD = parseInt(CODIGO);

                            if (proxCOD < 5) {

                                proxID++
                                proxCOD++

                                execute.executeSQL(`UPDATE ETAPA SET SITUACAO = 1 WHERE ID = ${proxID} AND CODIGO = ${proxCOD}`, function (results3) {
                                    if (results3['affectedRows'] > 0) {
                                        res.status(200).send('Etapa finalizada com sucesso!')
                                        atualizarStatus(ID)
                                    } else {
                                        res.status(203).send(results3);
                                    }
                                });

                            } else {
                                res.status(200).send('Etapa finalizada com sucesso!')
                                atualizarStatus(ID)
                            }
                        } else {
                            res.status(203).send(results2);
                        }
                    });

                } else {
                    res.status(203).send(results1);
                }
            });

        } else {
            res.status(203).send('Impossível finalizar, não existe nada produzido na etapa!');
        }
    })



})



function atualizarStatus(ID_ETAPA) {

    execute.executeSQL(`SELECT ID_ARCO FROM ETAPA WHERE ID = ${ID_ETAPA}`, function (results) {
        if (results.length > 0) {
            var sqlQry = `CALL SITUACAO_ARCO(${results[0].ID_ARCO});`;
            execute.executeSQL(sqlQry, function (results1) {
        
            });
        }
    });

}