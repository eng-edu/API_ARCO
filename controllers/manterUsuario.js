'use strict';

const execute = require('../executeSQL');

exports.logarUser = ('/logar/:EMAIL/:SENHA', (req, res) => {
    var sqlQry = `SELECT * FROM USUARIO WHERE EMAIL = '${req.params.EMAIL}' AND SENHA = '${req.params.SENHA}'`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results[0])
        } else {
            res.status(203).send('dados incorretos!');
        }
    });
})


exports.cadastrarUser = ('/cadastrar/:BIO/:NOME/:SOBRENOME/:CPF/:SEXO/:DATA_NASC/:ESCOLARIDADE/:EMAIL/:SENHA/:TIPO', (req, res) => {

    const BIO = req.params.BIO;
    const NOME = req.params.NOME;
    const SOBRENOME = req.params.SOBRENOME;
    const CPF = req.params.CPF;
    const SEXO = req.params.SEXO;
    const DATA_NASC = req.params.DATA_NASC;
    const ESCOLARIDADE = req.params.ESCOLARIDADE;
    const EMAIL = req.params.EMAIL;
    const SENHA = req.params.SENHA;
    const TIPO = req.params.TIPO

    var sqlQry1 = `SELECT * FROM USUARIO WHERE EMAIL = '${EMAIL}'`;
    execute.executeSQL(sqlQry1, function (results) {
        if (results.length > 0) {
            res.status(201).send('Email já cadastrado, tente outro!');
        } else {
            var fs = require('fs');
            res.setHeader("Access-Control-Allow-Origin", "*");
            var sqlQry = `INSERT INTO USUARIO (BIO, NOME, SOBRENOME, CPF, SEXO, DATA_NASC, ESCOLARIDADE, EMAIL, SENHA, TIPO) 
    VALUES ('${BIO}','${NOME}','${SOBRENOME}','${CPF}','${SEXO}','${DATA_NASC}','${ESCOLARIDADE}','${EMAIL}','${SENHA}','${TIPO}')`;

            execute.executeSQL(sqlQry, function (results) {

                if (results['insertId'] > 0) {

                    var CAMINHO = './uploads/' + results['insertId'] + "_usuario.jpg"
                    var TEMP = req.files.file.path;

                    fs.rename(TEMP, CAMINHO, function (err) {
                        if (err) {
                            res.status(203).send(err);
                        }
                    })
                    res.status(200).send(results);
                } else {
                    res.status(203).send(results);
                }

            });

        }
    });
});

exports.alterarComFoto = ('/alterarComFoto/:ID/:NOME/:IDADE/:SEXO/:ESCOLARIDADE', (req, res) => {

    const ID = req.params.ID
    const NOME = req.params.NOME;
    const IDADE = req.params.IDADE;
    const SEXO = req.params.SEXO;
    const ESCOLARIDADE = req.params.ESCOLARIDADE;

    var fs = require('fs');
    res.setHeader("Access-Control-Allow-Origin", "*");
    var sqlQry = `UPDATE USUARIO SET NOME = '${NOME}', IDADE = '${IDADE}', SEXO = '${SEXO}' , ESCOLARIDADE = '${ESCOLARIDADE}' WHERE ID = ${ID}`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['affectedRows'] > 0) {

            var CAMINHO = './uploads/' + ID + "_usuario.jpg"
            var TEMP = req.files.file.path;

            fs.rename(TEMP, CAMINHO, function (err) {
                if (err) {

                }
            })

            res.status(200).send(results);
            atualizarPontosUser(req.params.ID)
        } else {
            res.status(405).send(results);
        }

    });


});

