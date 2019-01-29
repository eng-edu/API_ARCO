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
    });
})


exports.buscar = ('/buscar/:ID', (req, res) => {
    var sqlQry = `SELECT * FROM USUARIO WHERE ID = '${req.params.ID}'`;
  
    atualizarPontosUser(req.params.ID)

    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results[0])
          
        } else {
            res.status(405).send(results);
        }
    });

})


function atualizarPontosUser(ID_USUARIO) {
    var sqlQry = `SELECT SUM(PONTO) AS PONTO FROM ARCO AS a INNER JOIN EQUIPE AS E ON a.ID = e.ID_ARCO WHERE e.ID_USUARIO = ${ID_USUARIO} AND a.SITUACAO = 0;`;
    execute.executeSQL(sqlQry, function (results) {
        execute.executeSQL(`UPDATE USUARIO SET PONTO = '${results[0]['PONTO']}' WHERE ID = ${ID_USUARIO}`, function (results) {
        });
    });
}

exports.inserir = ('/inserir/:NOME/:IDADE/:SEXO/:ESCOLARIDADE/:EMAIL/:SENHA/:TIPO', (req, res) => {

    const NOME = req.params.NOME;
    const IDADE = req.params.IDADE;
    const SEXO = req.params.SEXO;
    const ESCOLARIDADE = req.params.ESCOLARIDADE;
    const EMAIL = req.params.EMAIL;
    const SENHA = req.params.SENHA;
    const TIPO = req.params.TIPO

    var fs = require('fs');
    res.setHeader("Access-Control-Allow-Origin", "*");
    var sqlQry = `INSERT INTO USUARIO (NOME, IDADE, SEXO, ESCOLARIDADE, EMAIL, SENHA, TIPO) 
    VALUES ('${NOME}','${IDADE}','${SEXO}','${ESCOLARIDADE}','${EMAIL}','${SENHA}','${TIPO}')`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {

            var CAMINHO = './uploads/' + results['insertId'] + "_usuario.jpg"
            var TEMP = req.files.file.path;

            fs.rename(TEMP, CAMINHO, function (err) {
                if (err) {
    
                }
            })
            res.status(200).send(results);
        } else {
            res.status(405).send(results);
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

exports.alterar = ('/alterar/:ID/:NOME/:IDADE/:SEXO/:ESCOLARIDADE', (req, res) => {

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
            res.status(200).send(results);
            atualizarPontosUser(req.params.ID)
        } else {
            res.status(405).send(results);
        }
       
    });


});


exports.listar = ('/listar/:ID_ARCO', (req, res) => {
    
    var sqlQry = `SELECT 
    u.ID, u.NOME, u.EMAIL
FROM
    USUARIO AS u
        LEFT JOIN
    EQUIPE AS e ON u.ID = e.ID_USUARIO AND e.ID_ARCO = ${req.params.ID_ARCO}
WHERE
    e.ID_USUARIO IS NULL AND u.TIPO = 2;`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)

            results.forEach(element => {
                atualizarPontosUser(element.ID)
            });

        } else {
            res.status(405).send(results);
        }
        


    });

})

exports.novoMenbro = ('/novoMenbro/:ID_USUARIO/:ID_ARCO', (req, res) => {

    var sqlQry = `SELECT COUNT(*) FROM EQUIPE WHERE ID_ARCO = ${req.params.ID_ARCO}`;

    execute.executeSQL(sqlQry, function (results) {
        if (results[0]['COUNT(*)']<10) {
            res.status(200).send(results)
            inserirNovoMenbro(req.params.ID_ARCO, req.params.ID_USUARIO)
        } else {
            res.status(405).send(results);
        }
       
    });


})

function inserirNovoMenbro(ID_ARCO, ID_USUARIO) {
    var sqlQry = `INSERT INTO EQUIPE (ID_USUARIO, ID_ARCO) VALUES (${ID_USUARIO}, ${ID_ARCO})`;
    execute.executeSQL(sqlQry, function (results) {
    });
}