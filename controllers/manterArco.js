'use strict';
const execute = require('../executeSQL');

exports.buscarArcoDiscente = ('/buscarArcoDiscente/:DISCENTE_ID', (req, res) => {

    var sqlQry = `select ARCO.ID, ARCO.STATUS, ARCO.NOME, ARCO.ID_CRIADOR, ARCO.DOCENTE_ID, ARCO.COMPARTILHADO from ARCO inner join GRUPO where DISCENTE_ID = '${req.params.DISCENTE_ID}' AND ARCO.ID = GRUPO.ARCO_ID`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
    });

})

exports.novoArco = ('/novoArco/:JSON', (req, res) => {

    var jsonData = JSON.parse(req.params.JSON);

    const STATUS = "AGUARDANDO APROVAÇÃO DE ORIENTAÇÃO";
    const NOME = jsonData.NOMEARCO;
    const DOCENTE_ID = jsonData.DOCENTE_ID;
    const NOMEGRUPO = jsonData.NOMEGRUPO;
    const DISCENTES_ID = jsonData.DISCENTES_ID;
    const ID_CRIADOR = jsonData.ID_CRIADOR;
    var ARCO_ID = "";


    //----------------------------------------------------------------------------------------------------

    var sqlQry1 = `INSERT INTO ARCO (STATUS, NOME, ID_CRIADOR, DOCENTE_ID) VALUES ('${STATUS}','${NOME}','${ID_CRIADOR}','${DOCENTE_ID}')`;

    execute.executeSQL(sqlQry1, function (results) {

        if (results['insertId'] > 0) {
            ARCO_ID = results['insertId']
            criargrupo();
        } else {
            console.log(results);
        }

    });

    //----------------------------------------------------------------------------------------------------

    function criargrupo() {

        var sqlQry2 = `INSERT INTO GRUPO (NOME, DISCENTE_ID, ARCO_ID) VALUES`;

        sqlQry2 = sqlQry2 + (` ('${NOMEGRUPO}',${ID_CRIADOR},${ARCO_ID}), `);

        var size = DISCENTES_ID.length;
        var count = 0;

        DISCENTES_ID.forEach(element => {

            count = count + 1;

            if (count == size) {
                sqlQry2 = sqlQry2 + (` ('${NOMEGRUPO}',${element.DISCENTE_ID},${ARCO_ID});`);
            } else {
                sqlQry2 = sqlQry2 + (` ('${NOMEGRUPO}',${element.DISCENTE_ID},${ARCO_ID}), `);
            }

        });

        execute.executeSQL(sqlQry2, function (results) {

            if (results['insertId'] > 0) {
                cirarSolicitacao()
            } else {
                console.log(results);
            }

        });
    }



    //----------------------------------------------------------------------------------------------------

    function cirarSolicitacao() {

        var sqlQry3 = `INSERT INTO SOLICITACAO (ARCO_ID, DOCENTE_ID) VALUES ('${ARCO_ID}','${DOCENTE_ID}')`;

        execute.executeSQL(sqlQry3, function (results) {

            if (results['insertId'] > 0) {
                criarEtapas()
            } else {
                console.log(results);
            }

        });
    }


    //----------------------------------------------------------------------------------------------------

    function criarEtapas() {

        var sqlQry4 = `INSERT INTO ETAPA (NOME, RESUMO, STATUS, ARCO_ID) VALUES 
        ('OBSERVAÇÃO DA REALIDADE','', 5, '${ARCO_ID}'), 
        ('PONTOS CHAVES','', 5, '${ARCO_ID}'),
        ('TEORIZAÇÃO','', 5, '${ARCO_ID}'),
        ('HIPÓTESES DE SOLUÇÃO','', 5, '${ARCO_ID}'),
        ('APLICAÇÃO A REALIDADE','', 5,'${ARCO_ID}');`;

        execute.executeSQL(sqlQry4, function (results) {

            if (results['insertId'] > 0) {
                res.status(201).send({ 'ARCO_ID': ARCO_ID });
            } else {
                res.status(405).send(results);
                console.log(results);
            }

        });
    }


})

exports.compartilharArco = ('/compartilharArco/:ID/:COMPARTILHADO', (req, res) => {

    const ID = req.params.ID
    const COMPARTILHADO = req.params.COMPARTILHADO;
    var sqlQry = `UPDATE ARCO SET COMPARTILHADO = '${COMPARTILHADO}' WHERE ID = '${ID}'`

    execute.executeSQL(sqlQry, function (results) {
        if (results['affectedRows'] > 0) {
            res.status(201).send({ results });
        } else {
            res.status(405).send(results);
        }
    });

})

exports.excluirArco = ('/excluirArco/:ID', (req, res) => {

    var sqlQry1 = `DELETE FROM ETAPA WHERE ARCO_ID = '${req.params.ID}'`;
    var sqlQry2 = `DELETE FROM GRUPO WHERE ARCO_ID = '${req.params.ID}'`;
    var sqlQry3 = `DELETE FROM SOLICITACAO WHERE ARCO_ID = '${req.params.ID}'`;
    var sqlQry4 = `DELETE FROM ARCO WHERE ID = '${req.params.ID}'`;
    var sqlQry5 = `DELETE FROM DOCUMENTO WHERE ARCO_ID = '${req.params.ID}'`;

    excluirDocumentos()
    deletarGrupo()
    deletarSolicitacao()
    deletarArco()
    
    function deletarEtapa() {
        execute.executeSQL(sqlQry1, function (results) {
        });
    }

    function deletarGrupo() {
        execute.executeSQL(sqlQry2, function (results) {
        });
    }

    function deletarSolicitacao() {
        execute.executeSQL(sqlQry3, function (results) {
        });
    }

    function deletarArco() {
        execute.executeSQL(sqlQry4, function (results) {
            if (results['affectedRows'] > 0) {
                res.status(200).send({ results });
            } else {
                res.status(405).send(results);
            }
        });

    }


    function excluirDocumentos() {
        execute.executeSQL(sqlQry5, function (results) {

            if (results['affectedRows'] > 0) {
                deletarEtapa();
            } else {
                console.log(results)
            }

        });

    }
})

exports.bucarArcosCompartilhados = ('/bucarArcosCompartilhados', (req, res) => {
    var sqlQry = `SELECT * FROM ARCO WHERE COMPARTILHADO = 1 AND NOT ARCO.STATUS = 'AGUARDANDO APROVAÇÃO DE ORIENTAÇÃO';`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
    });

})

exports.buscarArcoDocente = ('/buscarArcoDocente/:DOCENTE_ID', (req, res) => {

    var sqlQry = `SELECT * FROM ARCO WHERE DOCENTE_ID = '${req.params.DOCENTE_ID}' AND NOT ARCO.STATUS = 'AGUARDANDO APROVAÇÃO DE ORIENTAÇÃO';`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
    });

})

