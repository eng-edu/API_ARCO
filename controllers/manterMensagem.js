'use strict';
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {
    io.on('LIST_MSG', (id) => {
        var s = 'msg' + id;
        var sqlQry = `SELECT * FROM MENSAGEM WHERE ID_ARCO = ${id}`;
        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
                io.emit(s, results);
                io.broadcast.emit(s, results);
            }
        });
    });
});

exports.post = ('/inserir/:ID_USUARIO/:TEXTO/:DATA/:HORA/:ID_ARCO', (req, res) => {

  
    const ID_USUARIO = req.params.ID_USUARIO;
    const TEXTO = req.params.TEXTO
    const DATA = req.params.DATA;
    const HORA = req.params.HORA;
    const ARCO_ID = req.params.ID_ARCO

    var sqlQry = `INSERT INTO MENSAGEM (ID_USUARIO, TEXTO, DATA, HORA, ARCO_ID) 
            VALUES (${ID_USUARIO},'${TEXTO}','${DATA}','${HORA}','${ARCO_ID}')`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            res.status(201).send({ results });
        } else {
            res.status(405).send(results);
        }
        console.log(results);
    });

});
