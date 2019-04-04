'use strict';

const socket = require('../server/serverSocket');
const execute = require('../executeSQL');


socket.on('connection', (io) => {

    io.on('OPINIAO', function (ID_ETAPA) {
        buscarOpiniao(io, ID_ETAPA)
    })

    io.on('EU_CURTI', function (results) {
        euCurti(io, results.ID_USUARIO, results.ID_OPINIAO)
    })

    io.on('CURTIU', function (results) {
        curtiu(io, results.ID_USUARIO, results.ID_OPINIAO, results.CURTIU)
    })

    io.on('EU_ESTRELAS', function (results) {
        euEstrelas(io, results.ID_USUARIO, results.ID_OPINIAO)
    })

    io.on('ESTRELAS', function (results) {
        estrelas(io, results.ID_USUARIO, results.ID_OPINIAO, results.QUANTIDADE)
    })


    io.on('QTD_CURTIDAS_ESTRELAS', function (ID_OPINIAO) {
        qtdCurtidasEstrelas(io, ID_OPINIAO)
    })

});



function buscarOpiniao(io, ID_ETAPA) {
    var msg = 'OPINIAO' + ID_ETAPA;
    var sqlQry = `SELECT 
    o.ID, o.ID_ETAPA, e.NOME AS NOME_ETAPA, o.ID_USUARIO, o.DATA_HORA, o.TEXTO, a.ID_LIDER
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
    INNER JOIN ARCO AS a ON e.ID_ARCO = a.ID
WHERE
    ID_ETAPA = ${ID_ETAPA} AND o.SITUACAO = 1 OR ID_ETAPA = ${ID_ETAPA} AND o.SITUACAO = 2`;

    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
    });
}

exports.atualizarOpiniao = ('/atualizarOpiniao/:ID_USUARIO/:ID_ETAPA/:TEXTO', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO;
    const ID_ETAPA = req.params.ID_ETAPA;
    const TEXTO = req.params.TEXTO;
    var DATA_HORA = require('./util').dataAtual();


    execute.executeSQL(`SELECT * FROM OPINIAO  WHERE ID_ETAPA = ${ID_ETAPA} AND ID_USUARIO = ${ID_USUARIO} AND SITUACAO = 2`, function (results) {
        if (results.length > 0) {
            res.status(203).send('Essa etapa já está filizada, volte ao menu anterior e trabalhe na próxima!');
        } else {

            execute.executeSQL(`UPDATE OPINIAO SET DATA_HORA = '${DATA_HORA}', TEXTO = '${TEXTO}' WHERE ID_ETAPA = ${ID_ETAPA} AND ID_USUARIO = ${ID_USUARIO} AND SITUACAO = 1`, function (results) {
                if (results['affectedRows'] > 0) {
                    res.status(200).send(results);
                } else {
                    res.status(203).send(results);
                }

            });
        }

    });


});

exports.buscarOpiniao2 = ('/buscarOpiniao/:ID_USUARIO/:ID_ETAPA', (req, res) => {

    const ID_USUARIO = req.params.ID_USUARIO;
    const ID_ETAPA = req.params.ID_ETAPA;

    var sqlQry = `SELECT  o.TEXTO
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
WHERE
    ID_ETAPA = ${ID_ETAPA} AND o.SITUACAO = 1 AND o.ID_USUARIO = ${ID_USUARIO} OR ID_ETAPA = ${ID_ETAPA} AND o.SITUACAO = 2 AND o.ID_USUARIO = ${ID_USUARIO};`;


    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results[0]);
        } else {

            inserirOpiniao(ID_USUARIO, ID_ETAPA, res)
        }

    });
});

function inserirOpiniao(ID_USUARIO, ID_ETAPA, res) {

    var DATA_HORA = require('./util').dataAtual();

    //SITUACAO 1 = EM DESENVOLVIMENTO
    //SITUACAO 2 = FINALIZADO

    var sqlQry = `INSERT INTO OPINIAO(ID_ETAPA, ID_USUARIO, SITUACAO, DATA_HORA, TEXTO) VALUES (${ID_ETAPA}, ${ID_USUARIO}, '1', '${DATA_HORA}', 'Desenvovlda seu tetxo aqui!')`;

    execute.executeSQL(sqlQry, function (results) {
        if (results['insertId'] > 0) {
            buscarOpiniao3(ID_USUARIO, ID_ETAPA, res)
        } else {
            res.status(203).send(results);
        }

    })
}

function buscarOpiniao3(ID_USUARIO, ID_ETAPA, res) {
    var sqlQry = `SELECT  o.TEXTO
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
WHERE
    ID_ETAPA = ${ID_ETAPA} AND o.SITUACAO = 1 AND o.ID_USUARIO = ${ID_USUARIO};`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results[0]);
        } else {
            res.status(203).send(results)
        }

    });
}

function euCurti(io, ID_USUARIO, ID_OPINIAO) {

    var msg = 'EU_CURTI' + ID_OPINIAO + ID_USUARIO;

    var sqlQry = `SELECT * FROM CURTIDA WHERE ID_USUARIO = ${ID_USUARIO} AND ID_OPINIAO = ${ID_OPINIAO}`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            io.emit(msg, results[0].CURTIU);
            io.broadcast.emit(msg, results[0].CURTIU);
        } else {
            io.emit(msg, '2');
            io.broadcast.emit(msg, '2');
        }

    });

}

function curtiu(io, ID_USUARIO, ID_OPINIAO, CURTIU) {

    var msg = 'EU_CURTI' + ID_OPINIAO + ID_USUARIO;

    execute.executeSQL(`SELECT * FROM CURTIDA WHERE ID_USUARIO = ${ID_USUARIO} AND ID_OPINIAO = ${ID_OPINIAO}`, function (results) {
        if (results.length > 0) {
            execute.executeSQL(`UPDATE CURTIDA SET CURTIU = ${CURTIU}  WHERE ID_USUARIO = ${ID_USUARIO} AND ID_OPINIAO = ${ID_OPINIAO}`, function (results) {
                if (results['affectedRows'] > 0) {
                    io.emit(msg, CURTIU);
                    io.broadcast.emit(msg, CURTIU);
                }
            });
        } else {
            execute.executeSQL(`INSERT INTO CURTIDA (ID_USUARIO, ID_OPINIAO, CURTIU) VALUES(${ID_USUARIO}, ${ID_OPINIAO}, '${CURTIU}') `, function (results) {
                if (results['insertId'] > 0) {
                    io.emit(msg, CURTIU);
                    io.broadcast.emit(msg, CURTIU);
                }
            });
        }

    });
}

function euEstrelas(io, ID_USUARIO, ID_OPINIAO) {

    var msg = 'EU_ESTRELAS' + ID_OPINIAO + ID_USUARIO;


    var sqlQry = `SELECT QUANTIDADE FROM ESTRELA WHERE ID_USUARIO = ${ID_USUARIO} AND ID_OPINIAO = ${ID_OPINIAO}`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            io.emit(msg, results[0].QUANTIDADE);
            io.broadcast.emit(msg, results[0].QUANTIDADE);
        } else {
            io.emit(msg, '0');
            io.broadcast.emit(msg, '0');
        }

    });
}

function estrelas(io, ID_USUARIO, ID_OPINIAO, QUANTIADE) {

    var msg = 'EU_ESTRELAS' + ID_OPINIAO + ID_USUARIO;


    execute.executeSQL(`SELECT QUANTIDADE FROM ESTRELA WHERE ID_USUARIO = ${ID_USUARIO} AND ID_OPINIAO = ${ID_OPINIAO}`, function (results) {
        if (results.length > 0) {
            execute.executeSQL(`UPDATE ESTRELA SET QUANTIDADE = ${QUANTIADE}  WHERE ID_USUARIO = ${ID_USUARIO} AND ID_OPINIAO = ${ID_OPINIAO}`, function (results) {
                if (results['affectedRows'] > 0) {
                    io.emit(msg, QUANTIADE);
                    io.broadcast.emit(msg, QUANTIADE);
                }
            });
        } else {
            execute.executeSQL(`INSERT INTO ESTRELA (ID_USUARIO, ID_OPINIAO, QUANTIDADE) VALUES(${ID_USUARIO}, ${ID_OPINIAO}, ${QUANTIADE}) `, function (results) {
                if (results['insertId'] > 0) {
                    io.emit(msg, QUANTIADE);
                    io.broadcast.emit(msg, QUANTIADE);
                }
            });
        }

    });


}


function qtdCurtidasEstrelas(io, ID_OPINIAO) {
    var msg = 'QTD_CURTIDAS_ESTRELAS' + ID_OPINIAO;

    execute.executeSQL(`SELECT COUNT(CURTIU)  AS CURTIU FROM CURTIDA WHERE ID_OPINIAO = ${ID_OPINIAO} AND CURTIU = 1`, function (results1) {


        execute.executeSQL(`SELECT SUM(QUANTIDADE) AS QUANTIDADE FROM ESTRELA WHERE ID_OPINIAO = ${ID_OPINIAO}`, function (results2) {

            io.emit(msg, 'Essa etapa possuí ' + results1[0].CURTIU + ' curtidas e ' + results2[0].QUANTIDADE + ' estrelas');
            io.broadcast.emit(msg, 'Essa etapa possuí ' + results1[0].CURTIU + ' curtidas e ' + results2[0].QUANTIDADE + ' estrelas');


        });

    });

}


exports.denunciar = ('/denunciar/:ID_OPINIAO/:ID_USUARIO/:TEXTO', (req, res) => {

    const ID_OPINIAO = req.params.ID_OPINIAO;
    const ID_USUARIO = req.params.ID_USUARIO;
    const TEXTO = req.params.TEXTO;

    var sqlQry = `INSERT INTO DENUNCIA_OPINIAO (ID_OPINIAO, ID_USUARIO, TEXTO) VALUES (${ID_OPINIAO}, ${ID_USUARIO}, '${TEXTO}')`;

    execute.executeSQL(sqlQry, function (results) {
        if (results['insertId'] > 0) {
            res.status(200).send('Denúncia realizada com sucesso!');
        } else {
            res.status(203).send('error!');
        }

    });
});