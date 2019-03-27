'use strict';
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');
const manterNotificacao = require('../controllers/manterNotificacao')



socket.on('connection', (io) => {
    io.on('SOLICITACAO', function (CODIGO) {
        buscarSolicitacao(io, CODIGO)
    })

    io.on('NUM_SOLICITACAO', function (CODIGO) {
        buscarNumSolicitacao(io, CODIGO)
    })


    io.on('EQUIPE', function (CODIGO) {
        buscarEquipe(io, CODIGO)
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


function buscarEquipe(io, CODIGO) {
    var msg = 'EQUIPE' + CODIGO;
    var sqlQry = `SELECT u.ID, u.NOME, u.SOBRENOME, u.DATA_NASC, u.ESCOLARIDADE FROM EQUIPE AS e INNER JOIN USUARIO AS u ON e.ID_USUARIO = u.ID WHERE CODIGO = '${CODIGO}' AND e.SITUACAO = 2;`;
    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
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

    execute.executeSQL(`SELECT * FROM ARCO WHERE CODIGO_EQUIPE = '${CODIGO}'`, function (results) {

        if (results.length > 0) {

            execute.executeSQL(`SELECT * FROM EQUIPE WHERE ID_USUARIO = ${ID_USUARIO} AND CODIGO = '${CODIGO}'`, function (results1) {

                if (results1.length > 0) {
                    res.status(203).send('Error, você tem vinculo com esse arco!');
                } else {

                    execute.executeSQL(`INSERT INTO EQUIPE (CODIGO, ID_USUARIO, SITUACAO) VALUES ('${CODIGO}',${ID_USUARIO}, 1)`, function (results2) {

                        if (results2['insertId'] > 0) {
                            execute.executeSQL(`SELECT ID, ID_LIDER FROM ARCO WHERE CODIGO_EQUIPE = '${CODIGO}'`, function (results3) {

                                if (results3.length > 0) {
                                    manterNotificacao.inserirNotificacao(results3[0].ID_LIDER, results3[0].ID, 'Você possui uma solicitação de participação!', res)

                                } else {
                                    res.status(203).send(results3);
                                }
                            });

                        } else {
                            res.status(203).send(results2);
                        }

                    });

                }
            });

        } else {
            res.status(203).send('Error, o codigo não existe!');
        }

    });

});


exports.removerMenbro = ('/removerMenbro/:CODIGO/:ID_USUARIO', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO;
    const CODIGO = req.params.CODIGO;

    execute.executeSQL(`SELECT 
    o.ID
FROM
    ARCO AS a
        INNER JOIN
    EQUIPE AS e ON a.CODIGO_EQUIPE = e.CODIGO
        INNER JOIN
    ETAPA AS et ON a.ID = et.ID_ARCO
        INNER JOIN
    OPINIAO AS o ON et.ID = o.ID_ETAPA WHERE e.ID_USUARIO = ${ID_USUARIO} AND e.CODIGO = '${CODIGO}'`, function (results1) {

                if (results1.length > 0) {

                    for(var i = 0; i < results1.length; i++){
                        execute.executeSQL(`DELETE FROM OPINIAO WHERE ID = ${results1[i].ID}`, function (results) {
                        
                        });
                    }
                    
                

                    execute.executeSQL(`DELETE FROM EQUIPE WHERE ID_USUARIO = ${ID_USUARIO} AND CODIGO = '${CODIGO}'`, function (results2) {

                        if (results2['affectedRows'] > 0) {

                            res.status(200).send('removido com sucesso!')

                        } else {
                            res.status(203).send(results2);
                        }

                    });

                } else {
                    execute.executeSQL(`DELETE FROM EQUIPE WHERE ID_USUARIO = ${ID_USUARIO} AND CODIGO = '${CODIGO}'`, function (results2) {

                        if (results1['affectedRows'] > 0) {

                            res.status(200).send('removido com sucesso!')

                        } else {
                            res.status(203).send(results2);
                        }

                    });
                }

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

    });

})

exports.aceitarSolicitacao = ('/aceitarSolicitacao/:CODIGO/:ID_USUARIO', (req, res) => {

    const CODIGO = req.params.CODIGO;
    const ID_USUARIO = req.params.ID_USUARIO;

    var sqlQry = `UPDATE EQUIPE SET SITUACAO = 2 WHERE ID_USUARIO = ${ID_USUARIO} AND CODIGO = '${CODIGO}'`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['affectedRows'] > 0) {
            execute.executeSQL(`SELECT ID FROM ARCO WHERE CODIGO_EQUIPE = '${CODIGO}'`, function (results1) {

                if (results1.length > 0) {
                    manterNotificacao.inserirNotificacao(ID_USUARIO, results1[0].ID, 'Você faz parte de um novo arco!', res)
                } else {
                    res.status(203).send(results1);
                }
            });

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


