'use strict';

const execute = require('../executeSQL');

exports.buscarEscolaridade = ('/buscarEscolaridade/:ID_USUARIO', (req, res) => {
    var sqlQry = `SELECT * FROM ESCOLARIDADE WHERE ID_USUARIO = ${req.params.ID_USUARIO}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results[0])
        }else{
            res.status(203).send('Informe sua escolaridade!')
        }
    });
})


exports.alterarComFoto = ('/alterarComFoto/:ID_USUARIO/:INSTITUICAO/:AREA/:ANO/:GRUPOS/:DESCRICAO', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO
    const INSTITUICAO = req.params.INSTITUICAO
    const AREA = req.params.AREA;
    const ANO = req.params.ANO;
    const GRUPOS = req.params.GRUPOS;
    const DESCRICAO = req.params.DESCRICAO;

    var fs = require('fs');
    res.setHeader("Access-Control-Allow-Origin", "*");
    var sqlQry = `UPDATE ESCOLARIDADE 
    SET INSTITUICAO = '${INSTITUICAO}', AREA = '${AREA}', ANO = '${ANO}', GRUPOS = '${GRUPOS}', DESCRICAO = '${DESCRICAO}' WHERE ID_USUARIO = ${ID_USUARIO}`;
    execute.executeSQL(sqlQry, function (results) {

        if (results['affectedRows'] > 0) {

            var CAMINHO = './uploads/' + ID_USUARIO + "_escolaridade.jpg"
            var TEMP = req.files.file.path;

            fs.rename(TEMP, CAMINHO, function (err) {
                if (err) {
                    res.status(405).send(results);
                }
            })
            res.status(200).send(results);
        } else {
            res.status(405).send(results);
        }

    });


});

exports.alterar = ('/alterar/:ID_USUARIO/:INSTITUICAO/:AREA/:ANO/:GRUPOS/:DESCRICAO', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO
    const INSTITUICAO = req.params.INSTITUICAO
    const AREA = req.params.AREA;
    const ANO = req.params.ANO;
    const GRUPOS = req.params.GRUPOS;
    const DESCRICAO = req.params.DESCRICAO;

    var sqlQry1 = `SELECT * FROM ESCOLARIDADE WHERE ID_USUARIO = ${ID_USUARIO}`;

    var sqlQry2 = `INSERT INTO ESCOLARIDADE (INSTITUICAO, AREA, ANO, GRUPOS, DESCRICAO, ID_USUARIO) VALUES ('${INSTITUICAO}', '${AREA}', '${ANO}', '${GRUPOS}', '${DESCRICAO}', ${ID_USUARIO})`;

    var sqlQry3 = `UPDATE ESCOLARIDADE SET INSTITUICAO = '${INSTITUICAO}', AREA = '${AREA}', ANO = '${ANO}', GRUPOS = '${GRUPOS}', DESCRICAO = '${DESCRICAO}' WHERE ID_USUARIO = ${ID_USUARIO}`;


    execute.executeSQL(sqlQry1, function (results) {
        if (results.length > 0) {
            execute.executeSQL(sqlQry3, function (results) {
                if (results['affectedRows'] > 0) {
                    res.status(200).send(results);
                } else {
                    res.status(203).send(results);
                    console.log(results)
                }
            });
        } else {
            execute.executeSQL(sqlQry2, function (results) {
                if (results['affectedRows'] > 0) {
                    res.status(200).send(results);
                } else {
                    res.status(203).send(results);
                    console.log(results)
                }
            });
        }
    });





});
