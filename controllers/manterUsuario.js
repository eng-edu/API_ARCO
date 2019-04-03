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
exports.recuperarSenha = ('/recuperarSenha/:EMAIL/:DATA_NASC', (req, res) => {
    
    const EMAIL = req.params.EMAIL;
    var sqlQry = `SELECT * FROM USUARIO WHERE EMAIL = '${EMAIL}' AND DATA_NASC = '${req.params.DATA_NASC}'`;
    
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {

            var randomstring = Math.random().toString(36).slice(-10);
            console.log(randomstring)

            var sqlQry = `UPDATE USUARIO SET SENHA = '${randomstring}' WHERE EMAIL = '${EMAIL}'`;
            execute.executeSQL(sqlQry, function (results) {
                  enviarEmail(EMAIL, randomstring, res)
            });

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

exports.buscarUsuario = ('/buscarUsuario/:ID', (req, res) => {
    var sqlQry = `SELECT * FROM USUARIO WHERE ID = '${req.params.ID}'`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results[0])
        } else {
            res.status(203).send('Usuario não encontrado!');
        }
    });
})


exports.buscarRanking = ('/Ranking', (req, res) => {
    var sqlQry = `SELECT 
    eu.ID_USUARIO,
    eu.ID_ESPECIALIDADE,
    SUM(eu.CURTIDAS) AS CURTIDAS,
    SUM(eu.ESTRELAS) AS ESTRELAS,
    es.NOME,
    es.NIVEL
FROM
    ESPECIALIDADE_DO_USUARIO AS eu
    INNER JOIN ESPECIALIDADE AS es ON  es.ID = eu.ID_ESPECIALIDADE
GROUP BY (eu.ID_USUARIO)
ORDER BY eu.ESTRELAS DESC , eu.CURTIDAS DESC`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(203).send(results)
        }
    });
})




exports.alterarComFoto = ('/alterarComFoto/:ID/:BIO/:NOME/:SOBRENOME/:CPF/:SEXO/:DATA_NASC/:ESCOLARIDADE/', (req, res) => {

    const ID = req.params.ID
    const BIO = req.params.BIO
    const NOME = req.params.NOME;
    const SOBRENOME = req.params.SOBRENOME;
    const CPF = req.params.CPF
    const SEXO = req.params.SEXO;
    const DATA_NASC = req.params.DATA_NASC
    const ESCOLARIDADE = req.params.ESCOLARIDADE;

    var fs = require('fs');
    res.setHeader("Access-Control-Allow-Origin", "*");
    var sqlQry = `UPDATE USUARIO 
    SET BIO = '${BIO}', NOME = '${NOME}', SOBRENOME = '${SOBRENOME}', CPF = '${CPF}', SEXO = '${SEXO}', DATA_NASC = '${DATA_NASC}', ESCOLARIDADE = '${ESCOLARIDADE}' WHERE ID = ${ID}`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['affectedRows'] > 0) {

            var CAMINHO = './uploads/' + ID + "_usuario.jpg"
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

exports.alterar = ('/alterar/:ID/:BIO/:NOME/:SOBRENOME/:CPF/:SEXO/:DATA_NASC/:ESCOLARIDADE/', (req, res) => {

    const ID = req.params.ID
    const BIO = req.params.BIO
    const NOME = req.params.NOME;
    const SOBRENOME = req.params.SOBRENOME;
    const CPF = req.params.CPF
    const SEXO = req.params.SEXO;
    const DATA_NASC = req.params.DATA_NASC
    const ESCOLARIDADE = req.params.ESCOLARIDADE;

    var sqlQry = `UPDATE USUARIO 
    SET BIO = '${BIO}', NOME = '${NOME}', SOBRENOME = '${SOBRENOME}', CPF = '${CPF}', SEXO = '${SEXO}', DATA_NASC = '${DATA_NASC}', ESCOLARIDADE = '${ESCOLARIDADE}' WHERE ID = ${ID}`;

    execute.executeSQL(sqlQry, function (results) {
        if (results['affectedRows'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(405).send(results);
        }
    });
});

function enviarEmail(destinatario, novasenha, res){

    var nodemailer = require('nodemailer');

    var usuario = 'eduardo.eng15@hotmail.com';
    var senha = '6code384'; 
    
    var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: usuario,
            pass: senha
        }
    });
    
    var mailOptions = {
        from: usuario,
        to: destinatario,
        subject: 'Recuperaração de senha',
        text: 'Sua nova senha é: '+ novasenha
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send(203).send('error')
        } else {
            console.log('Email enviado: ' + info.response);
            res.status(200).send('email enviado com sucesso!')
        }
    });
}