'use strict';

const execute = require('../executeSQL');


exports.buscarUsuarioEmailSenha = ('/buscarUsuarioEmailSenha/:EMAIL/:SENHA', (req, res) => {
    var sqlQry = `SELECT * FROM USUARIO WHERE EMAIL = '${req.params.EMAIL}' AND SENHA = '${req.params.SENHA}'`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results[0])
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})


exports.buscar = ('/buscar/:ID', (req, res) => {
    var sqlQry = `SELECT * FROM USUARIO WHERE ID = '${req.params.ID}'`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})

exports.inserir = ('/inserir/:NOME/:IDADE/:SEXO/:ESCOLARIDADE/:EMAIL/:SENHA/:TIPO', (req, res) => {

    const NOME = req.params.NOME;
    const IDADE = req.params.IDADE;
    const FOTO = req.files.file.path;
    const SEXO = req.params.SEXO;
    const ESCOLARIDADE = req.params.ESCOLARIDADE;
    const EMAIL = req.params.EMAIL;
    const SENHA = req.params.SENHA;
    const TIPO = req.params.TIPO

    var fs = require('fs');
    res.setHeader("Access-Control-Allow-Origin", "*");
    var sqlQry = `INSERT INTO USUARIO (NOME, IDADE, FOTO, SEXO, ESCOLARIDADE, EMAIL, SENHA, TIPO) 
    VALUES ('${NOME}','${IDADE}','${FOTO}','${SEXO}','${ESCOLARIDADE}','${EMAIL}','${SENHA}','${TIPO}')`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            
            var CAMINHO = './uploads/' + results['insertId'] + "_usuario.jpg"
            var TEMP = req.files.file.path;

            fs.rename(TEMP, CAMINHO, function (err) {
                if (err) {
                    console.log(err);
                }
            })
            res.status(200).send(results);
        } else {
            res.status(405).send(results);
        }
        console.log(results);
    });


});

exports.listar = ('/listar', (req, res) => {
    var sqlQry = `SELECT * FROM USUARIO`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})

