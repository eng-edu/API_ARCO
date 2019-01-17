'use strict';

const execute = require('../executeSQL');

exports.buscar = ('/BUSCAR/:ID', (req, res) => {
    var sqlQry = `SELECT * FROM DOCENTE WHERE ID = '${req.params.ID}'`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})

exports.inserir = ('/inserir/:NOME/:IDADE/:FOTO/:SEXO/:ESCOLARIDADE/:EMAIL/:SENHA', (req, res) => {

 
    const NOME = req.params.NOME;
    const IDADE = req.params.IDADE;
    const FOTO = req.files.file.path;
    const SEXO = req.params.SEXO;
    const ESCOLARIDADE = req.params.ESCOLARIDADE;
    const EMAIL = req.params.EMAIL;
    const SENHA = req.params.SENHA;

    var fs = require('fs');
    res.setHeader("Access-Control-Allow-Origin", "*");
    var sqlQry = `INSERT INTO USUARIO (NOME, IDADE, FOTO, SEXO, ESCOLARIDADE, EMAIL, SENHA) 
    VALUES ('${NOME}','${IDADE}','${FOTO}','${SEXO}','${ESCOLARIDADE}','${EMAIL}','${SENHA}')`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            
            var CAMINHO = './uploads/' + results['insertId'] + "_usuario.jpg"
            var TEMP = req.files.file.path;

            fs.rename(TEMP, CAMINHO, function (err) {
                if (err) {
                    console.log(err);
                }
            })
            res.status(200).send({ results });
        } else {
            res.status(405).send(results);
        }
        console.log(results);
    });




});

exports.listar = ('/LISTAR', (req, res) => {
    var sqlQry = `SELECT * FROM DOCENTE`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})

