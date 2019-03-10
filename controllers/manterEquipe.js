'use strict';
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');


    socket.on('teste', function (teste) {
        console.log(teste)
    })


exports.buscar = ('/buscar/:ID_ARCO', (req, res) => {
    var sqlQry = `SELECT * FROM EQUIPE WHERE ID = '${req.params.ID}'`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }

    });

})

exports.inserirMenbro = ('/inserirMenbro/:CODIGO/:ID_USUARIO/', (req, res) => {

    const CODIGO = req.params.CODIGO;
    const ID_USUARIO = req.params.ID_USUARIO;


    //SITUACAO 1 = AGUARDANDO
    //SITUACAO 2 = APROVADO


    var sqlQry = `SELECT * FROM EQUIPE WHERE ID_USUARIO = ${ID_USUARIO}`;

    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(203).send('Error, você tem vinculo com esse arco!');
        } else {

            var sqlQry = `INSERT INTO EQUIPE (CODIGO, ID_USUARIO, SITUACAO) VALUES ('${CODIGO}',${ID_USUARIO}, 1)`;
            execute.executeSQL(sqlQry, function (results) {

                if (results['insertId'] > 0) {
                    inserirOpiniao(results['insertId'], ID_USUARIO, res)
                } else {
                    res.status(203).send(results);
                }

            });

        }
    });

});


exports.teste = ('/teste', (req, res) => {
    res.status(200).send('testando...')
        socket.emit('teste', 'testando')
});

function notiificarLider(CODIGO) {
    var sqlQry2 = `SELECT * FROM ARCO WHERE CODIGO_EQUIPE = '${CODIGO}'`;
    execute.executeSQL(sqlQry2, function (results) {
        if (results.results > 0) {

        } else {

        }
    });
}


function inserirOpiniao(ID_ETAPA, ID_USUARIO, res) {

    //STATUS 1 = EM DESENVOLVIMENTO
    //STATUS 2 = FINALIZADO

    var DATA_HORA = require('./util').dataAtual();

    var sqlQry2 = `INSERT INTO OPINIAO (ID_ETAPA, ID_USUARIO, DATA_HORA, STATUS, ESTRELAS) 
    VALUES (${ID_ETAPA},${ID_USUARIO},'${DATA_HORA}',1,0)`;

    execute.executeSQL(sqlQry2, function (results) {
        if (results['insertId'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(203).send(results);
        }
    });
}


exports.removerMenbro = ('/removerMenbro/:ID_USUARIO', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO;

    var sqlQry = `DELETE FROM EQUIPE WHERE ID_USUARIO = '${ID_USUARIO}'`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['affectedRows'] > 0) {
            removerOpiniao(ID_USUARIO, res)
        } else {
            res.status(203).send(results);
        }

    });

});


function removerOpiniao(ID_USUARIO, res) {

    var sqlQry2 = `DELETE FROM OPINIAO WHERE ID_USUARIO = ${ID_USUARIO}`;
    execute.executeSQL(sqlQry2, function (results) {
        if (results['affectedRows'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(203).send(results);
        }
    });
}


exports.listar = ('/listar', (req, res) => {
    var sqlQry = `SELECT * FROM EQUIPE`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }

    });

})

