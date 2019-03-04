'use strict';

const execute = require('../executeSQL');

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

exports.inserirMenbro = ('/inserirMenbro/:ID_ARCO/:ID_USUARIO/:NOME', (req, res) => {

    const ID_ARCO = req.params.ID_ARCO;
    const ID_USUARIO = req.params.ID_USUARIO;
    const NOME = req.params.NOME;

    var sqlQry = `INSERT INTO EQUIPE (ID_ARCO, ID_USUARIO, NOME) 
    VALUES (${ID_ARCO},${ID_USUARIO},'${NOME}')`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            inserirOpiniao(results['insertId'],ID_USUARIO, res)
        } else {
            res.status(203).send(results);
        }

    });

});


function inserirOpiniao(ID_ETAPA, ID_USUARIO, res) {

    //STATUS 1 = EM DESENVOLVIMENTO
    //STATUS 2 = FINALIZADO

    var DATA_HORA = require('./util').dataAtual();

    var sqlQry2 = `INSERT INTO OPINIAO (ID_ETAPA, ID_USUARIO, DATA_HORA, STATUS, ESTRELAS) 
    VALUES (${ID_ETAPA},${ID_USUARIO},'${DATA_HORA}',1,0)`;

    execute.executeSQL(sqlQry2, function (results) {
        if (results['insertId'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(203).send(results);
        }
    });
}


exports.removerMenbro = ('/removerMenbro/:ID_USUARIO', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO;
   
    var sqlQry = `DELETE FROM EQUIPE WHERE ID_USUARIO = '${ID_USUARIO}'`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['affectedRows'] > 0) {
        removerOpiniao(ID_USUARIO, res)
        } else {
            res.status(203).send(results);
        }

    });

});


function removerOpiniao(ID_USUARIO, res) {

    var sqlQry2 = `DELETE FROM OPINIAO WHERE ID_USUARIO = ${ID_USUARIO}`;
    execute.executeSQL(sqlQry2, function (results) {
        if (results['affectedRows'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(203).send(results);
        }
    });
}


exports.listar = ('/listar', (req, res) => {
    var sqlQry = `SELECT * FROM EQUIPE`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }

    });

})

