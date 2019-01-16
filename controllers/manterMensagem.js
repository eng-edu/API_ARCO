'use strict';
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {
    io.on('LIST_MSG', (id) => {
        var s = 'msg' + id;
        var sqlQry = `SELECT * FROM MENSAGEM WHERE ARCO_ID = ${id}`;
        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
                io.emit(s, results);
                io.broadcast.emit(s, results);
            }
        });
    });
});

exports.post = ('/sendMSG/:TEXTO/:ID_AUTOR/:EMAIL_AUTOR/:DATA/:ARCO_ID', (req, res) => {

    const TEXTO = req.params.TEXTO;
    const ID_AUTOR = req.params.ID_AUTOR;
    const DATA = req.params.DATA;
    const ARCO_ID = req.params.ARCO_ID;
    var EMAIL_AUTOR = req.params.EMAIL_AUTOR

    var sqlQry = `INSERT INTO MENSAGEM (TEXTO, ID_AUTOR, EMAIL_AUTOR, DATA, ARCO_ID) VALUES ('${TEXTO}',${ID_AUTOR},'${EMAIL_AUTOR}','${DATA}',${ARCO_ID})`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            res.status(201).send({ results });
        } else {
            res.status(405).send(results);
        }
        console.log(results);
    });

});
