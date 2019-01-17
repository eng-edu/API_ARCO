'use strict';

const execute = require('../executeSQL');

exports.buscar = ('/buscar/:ID', (req, res) => {
    var sqlQry = `SELECT * FROM ARCO WHERE ID = '${req.params.ID}'`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})

exports.inserir = ('/inserir/:ID_TEMATICA/:TITULO/:ID_LIDER/:PONTO/:LIKE/:DESLAIKE/:DENUNCIA/:STATUS', (req, res) => {

    const ID_TEMATICA = req.params.ID_TEMATICA;
    const TITULO = req.params.TITULO;
    const ID_LIDER = req.params.ID_LIDER;
    const PONTO = req.params.PONTO;
    const LIKE = req.params.LIKE;
    const DESLAIKE = req.params.DESLAIKE;
    const DENUNCIA = req.params.DENUNCIA;
    const STATUS = req.params.STATUS;

    var sqlQry = `INSERT INTO USUARIO (ID_TEMATICA, TITULO, ID_LIDER, PONTO, LIKE, DESLAIKE, DENUNCIA, STATUS) 
    VALUES ('${ID_TEMATICA}','${TITULO}','${ID_LIDER}','${PONTO}','${LIKE}','${DESLAIKE}','${DENUNCIA}','${STATUS}')`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            res.status(200).send({ results });
        } else {
            res.status(405).send(results);
        }
        console.log(results);
    });

});

exports.listar = ('/listar', (req, res) => {
    var sqlQry = `SELECT * FROM ARCO`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})

