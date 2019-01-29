'use strict';

const execute = require('../executeSQL');


exports.listar = ('/listar', (req, res) => {
    var sqlQry = `SELECT * FROM TEMATICA`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
       
    });

})

