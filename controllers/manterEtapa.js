'use strict';

const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {
    io.on('ETAPA', function (MSG) {
        var sqlQry = `SELECT * FROM ETAPA WHERE ID_ARCO = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry, function (results) {
    
            if (results.length > 0) {
                soulider(MSG.ID_USUARIO, MSG.ID_ARCO, io, results)
            } else {
                res.status(405).send(results);
            }
        });
    })

    io.on('FINALIZAR_LIDER', function(MSG){
        var sqlQry = `UPDATE ETAPA SET PONTO = '${MSG.PONTO}', STATUS = 3 WHERE CODIGO = ${MSG.CODIGO} AND ID_ARCO = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry, function (results) {
        });
    })   
    io.on('FINALIZAR_MENBRO', function(MSG){
        var sqlQry = `UPDATE ETAPA SET TEXTO = '${MSG.TEXTO}', STATUS = 2 WHERE CODIGO = ${MSG.CODIGO} AND ID_ARCO = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry, function (results) {
        });
    })   

    io.on('SALVAR', function(MSG){
        var sqlQry = `UPDATE ETAPA SET TEXTO = '${MSG.TEXTO}' WHERE CODIGO = '${MSG.CODIGO}' AND ID_ARCO = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry, function (results) {
            console.log(results)
        });

        console.log(MSG)
    })
    

});

exports.buscar = ('/buscar/:ID_ARCO/:ID_USUARIO', (req, res) => {
    var sqlQry = `SELECT * FROM ETAPA WHERE ID_ARCO = ${req.params.ID_ARCO} AND SITUACAO = 1 OR SITUACAO = 3;`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            soulider(req.params.ID_USUARIO, req.params.ID_ARCO, res, results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
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
        console.log(results);
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
        console.log(results)
    });

})

function soulider(ID_USUARIO, ID_ARCO, io, json) {
    var sqlQry = `SELECT * FROM ARCO WHERE ID_LIDER = ${ID_USUARIO} AND ID = ${ID_ARCO};`;
    execute.executeSQL(sqlQry, function (results) {
        var x;
        if (results.length > 0) {
            x = 'S'
        } else {
            x = 'N'
        }
        souMenbro(ID_USUARIO, ID_ARCO, io, json, x)

    });
}

function souMenbro(ID_USUARIO, ID_ARCO, io, json, SOULIDER) {
    var sqlQry = `SELECT * FROM EQUIPE WHERE ID_USUARIO = ${ID_USUARIO} AND ID_ARCO = ${ID_ARCO};`;
    execute.executeSQL(sqlQry, function (results) {

        var x;
        if (results.length > 0) {
            x = 'S'
        } else {
            x = 'N'
        }
        json[0].SOULIDER = SOULIDER
        json[0].SOUMENBRO = x
        json[1].SOULIDER = SOULIDER
        json[1].SOUMENBRO = x
        json[2].SOULIDER = SOULIDER
        json[2].SOUMENBRO = x
        json[3].SOULIDER = SOULIDER
        json[3].SOUMENBRO = x
        json[4].SOULIDER = SOULIDER
        json[4].SOUMENBRO = x
        io.emit("ETAPA"+ID_ARCO, json);
        io.broadcast.emit("ETAPA"+ID_ARCO, json);
    });
}