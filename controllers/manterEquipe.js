'use strict';
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {
    io.on('SOLICITACAO', function (CODIGO) {
        buscarSolicitacao(io, CODIGO)
    })

    io.on('NUM_SOLICITACAO', function (CODIGO) {
        buscarNumSolicitacao(io, CODIGO)
    })

});

function buscarSolicitacao(io, CODIGO) {
    var msg = 'SOLICITACAO' + CODIGO;
    var sqlQry = `SELECT u.ID, u.NOME, u.SOBRENOME, u.DATA_NASC, u.ESCOLARIDADE FROM EQUIPE AS e INNER JOIN USUARIO AS u ON e.ID_USUARIO = u.ID WHERE CODIGO = '${CODIGO}' AND e.SITUACAO = 1;`;
    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
    });
}


function buscarNumSolicitacao(io, CODIGO) {
    var msg = 'NUM_SOLICITACAO' + CODIGO;
    var sqlQry = `SELECT count(e.ID) AS NUM_SOLICITACOES FROM EQUIPE AS e INNER JOIN USUARIO AS u ON e.ID_USUARIO = u.ID WHERE CODIGO = '${CODIGO}' AND e.SITUACAO = 1;`;
    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results[0]['NUM_SOLICITACOES']);
        io.broadcast.emit(msg, results[0]['NUM_SOLICITACOES']);
    });
}


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
                    res.status(200).send(results);
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


exports.aceitarSolicitacao = ('/aceitarSolicitacao/:CODIGO/:ID_USUARIO', (req, res) => {

    const CODIGO = req.params.CODIGO;
    const ID_USUARIO = req.params.ID_USUARIO;

    var sqlQry = `UPDATE EQUIPE SET SITUACAO = 2 WHERE ID_USUARIO = ${ID_USUARIO} AND CODIGO = '${CODIGO}'`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['affectedRows'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(203).send(results);
        }

    });

});

exports.recusarSolicitacao = ('/recusarSolicitacao/:CODIGO/:ID_USUARIO', (req, res) => {

    const CODIGO = req.params.CODIGO;
    const ID_USUARIO = req.params.ID_USUARIO;

    var sqlQry = `DELETE FROM EQUIPE WHERE ID_USUARIO = ${ID_USUARIO} AND CODIGO = '${CODIGO}'`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['affectedRows'] > 0) {
            res.status(200).send(results);
        } else {
            res.status(203).send(results);
        }

    });

});
