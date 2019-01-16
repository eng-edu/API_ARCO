'use strict';

const execute = require('../executeSQL');

exports.get = ('/buscarArquivos/:ETAPA_ID', (req, res) => {
    var sqlQry = `SELECT * FROM DOCUMENTO WHERE ETAPA_ID = '${req.params.ETAPA_ID}'`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
    });

})

exports.post = ('/:JSON', (req, res) => {

    var jsonData = JSON.parse(req.params.JSON);

    const NOME = jsonData.NOME;
    const BASE64 = jsonData.BASE64;
    const ETAPA_ID = jsonData.ETAPA_ID;
    const ETAPA_ARCO_ID = jsonData.ETAPA_ARCO_ID;

    var sqlQry = `INSERT INTO DOCUMENTO (NOME, BASE64, ETAPA_ID, ETAPA_ARCO_ID) VALUES ('${NOME}','${BASE64}','${ETAPA_ID}','${ETAPA_ARCO_ID}')`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            res.status(201).send({ results });
        } else {
            res.status(405).send(results);
        }
        console.log(results);
    });

});

exports.put = ('/:ID/:NOME/:CAMINHO/:ETAPA_ID/:ETAPA_ARCO_ID', (req, res) => {

    const ID = req.params.ID
    const NOME = req.params.NOME;
    const CAMINHO = req.params.CAMINHO;
    const ETAPA_ID = req.params.ETAPA_ID;
    const ETAPA_ARCO_ID = req.params.ETAPA_ARCO_ID;

    var sqlQry = `UPDATE DOCUMENTO SET NOME = '${NOME}', CAMINHO = '${CAMINHO}', ETAPA_ID = '${ETAPA_ID}', ETAPA_ARCO_ID = '${ETAPA_ARCO_ID}' WHERE ID = '${ID}'`

    execute.executeSQL(sqlQry, function (results) {
        if (results['affectedRows'] > 0) {
            res.status(201).send({ results });
        } else {
            res.status(405).send(results);
        }
        console.log(results);
    });

});

exports.delet = ('/apagarArquivosEtapa/:ID', (req, res) => {
   
    var sqlQry1 = `SELECT CAMINHO FROM BDARCO.DOCUMENTO WHERE ID = '${req.params.ID}'`;
    var sqlQry2 = `DELETE FROM DOCUMENTO WHERE ID = '${req.params.ID}'`;
  
    execute.executeSQL(sqlQry1, function (results) {
        if (results.length > 0) {
        
            //apaga local
            var caminho = results[0].CAMINHO
            var fs = require('fs')
            fs.unlinkSync(caminho)



        }
    });



 execute.executeSQL(sqlQry2, function (results) {

     if (results['affectedRows'] > 0) {
         res.status(200).send({ results });
     } else {
         res.status(405).send(results);
     }
     console.log(results);
 });


  

})

