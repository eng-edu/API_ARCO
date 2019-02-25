'use strict';

const execute = require('../executeSQL');

exports.buscarEscolaridade = ('/buscarEscolaridade/:ID_USUARIO', (req, res) => {
    var sqlQry = `SELECT * FROM ESCOLARIDADE WHERE ID_USUARIO = ${req.params.ID_USUARIO}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results[0])
        }
    });
})
