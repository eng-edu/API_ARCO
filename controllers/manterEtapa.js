'use strict';

const execute = require('../executeSQL');

exports.buscar = ('/buscar/:ID_ARCO/:ID_USUARIO', (req, res) => {
    var sqlQry = `SELECT * FROM ETAPA WHERE ID_ARCO = ${req.params.ID_ARCO} AND SITUACAO = 1 OR SITUACAO = 3;`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            soulider(req.params.ID_USUARIO, req.params.ID_ARCO, res, results)
        } else {
            res.status(405).send(results);
        }
       
    });

})

exports.inserir = ('/inserir/:CODIGO/:TITULO/:ID_ARCO/:TEXTO/:PONTO/:STATUS', (req, res) => {

    const CODIGO = req.params.CODIGO;
    const TITULO = req.params.TITULO;
    const ID_ARCO = req.params.ID_ARCO;
    const TEXTO = req.params.TEXTO;
    const PONTO = req.params.PONTO;
    const STATUS = req.params.STATUS;

    var sqlQry = `INSERT INTO USUARIO (CODIGO, TITULO, ID_ARCO, TEXTO, PONTO, STATUS) 
    VALUES ('${CODIGO}','${TITULO}','${ID_ARCO}','${TEXTO}','${PONTO}','${STATUS}')`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            res.status(200).send({ results });
        } else {
            res.status(405).send(results);
        }
       
    });

});

exports.listar = ('/listar', (req, res) => {
    var sqlQry = `SELECT * FROM ETAPA`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
       
    });

})
