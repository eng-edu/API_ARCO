'use strict';

const execute = require('../executeSQL');

exports.buscar = ('/buscar/:ID', (req, res) => {
    var sqlQry = `SELECT * FROM EQUIPE WHERE ID = '${req.params.ID}'`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})

exports.inserir = ('/inserir/:ID_USUARIO/:ID_ARCO/:NOME', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO;
    const ID_ARCO = req.params.ID_ARCO;
    const NOME = req.params.NOME;
    
    var sqlQry = `INSERT INTO EQUIPE (ID_USUARIO, ID_ARCO, NOME) 
    VALUES ('${ID_USUARIO}','${ID_ARCO}','${NOME})`;

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
    var sqlQry = `SELECT * FROM EQUIPE`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})

