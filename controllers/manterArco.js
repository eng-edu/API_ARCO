'use strict';

const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {

    io.on('ARCO', function (ID_ARCO) {
        atualizarPontos(io,ID_ARCO)

    })

    io.on('TITULO', function (MSG) {
        var sqlQry = `UPDATE ARCO SET TITULO = '${MSG.TITULO}' WHERE ID = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry, function (results) {
        });
    })

    io.on('EU_GOSTEI', function (MSG) {
        var sqlQry = `SELECT COUNT(*) AS EU_CURTI FROM
        ARCO AS a
            INNER JOIN
        INFO_ARCO AS i ON a.ID = i.ID_ARCO WHERE a.ID = ${MSG.ID_ARCO} AND i.ID_USUARIO = ${MSG.ID_USUARIO};`;

        var msg = "EU_GOSTEI" + MSG.ID_USUARIO

        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
                io.emit(msg, results[0]);
                io.broadcast.emit(msg, results[0]);
            }
        });

    })

    io.on('GOSTEI', function (MSG) {
        var sqlQry = `INSERT INTO INFO_ARCO (ID_USUARIO, ID_ARCO, TIPO) 
            VALUES ('${MSG.ID_USUARIO}','${MSG.ID_ARCO}','1');`;
        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {

            }
        });
    })

    io.on('NGOSTEI', function (MSG) {
        var sqlQry = `DELETE FROM INFO_ARCO WHERE ID_USUARIO = ${MSG.ID_USUARIO} AND ID_ARCO = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
            }
        });
    })

    io.on('EQUIPE', function (ID_ARCO) {
        var msg = 'EQUIPE' + ID_ARCO;
        var sqlQry = `SELECT u.ID, u.NOME, u.EMAIL FROM EQUIPE AS e INNER JOIN USUARIO as u ON u.ID = e.ID_USUARIO WHERE u.TIPO = 2 AND ID_ARCO = ${ID_ARCO} GROUP BY e.ID_USUARIO;`;
        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
                io.emit(msg, results);
                io.broadcast.emit(msg, results);
            }
        });
    })

    io.on('ETAPA', function (ID_ARCO) {
        var sqlQry = `SELECT * FROM ETAPA WHERE ID_ARCO = ${ID_ARCO};`;
        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
                io.emit("ETAPA" + ID_ARCO, results);
                io.broadcast.emit("ETAPA" + ID_ARCO, results);
            }
        });
    })

    io.on('FINALIZAR_LIDER', function (MSG) {
        var sqlQry1 = `UPDATE ETAPA SET PONTO = '${MSG.PONTO}', SITUACAO = 3 WHERE CODIGO = ${MSG.CODIGO} AND ID_ARCO = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry1, function (results) {
        });
        var prox = parseInt(MSG.CODIGO);
        prox = prox + 1
        var sqlQry2 = `UPDATE ETAPA SET SITUACAO = 1 WHERE CODIGO = ${prox} AND ID_ARCO = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry2, function (results) {
        });

        console.log(MSG)

    })

    io.on('FINALIZAR_MENBRO', function (MSG) {
        var sqlQry = `UPDATE ETAPA SET TEXTO = '${MSG.TEXTO}', SITUACAO = 2 WHERE CODIGO = ${MSG.CODIGO} AND ID_ARCO = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry, function (results) {
        });
    })

    io.on('SALVAR', function (MSG) {
        var sqlQry = `UPDATE ETAPA SET TEXTO = '${MSG.TEXTO}' WHERE CODIGO = '${MSG.CODIGO}' AND ID_ARCO = ${MSG.ID_ARCO};`;
        execute.executeSQL(sqlQry, function (results) {
        });
    })

});

function atualizarPontos(io,ID_ARCO) {
    var sqlQry = `SELECT SUM(PONTO) AS PONTO FROM ETAPA WHERE ID_ARCO = ${ID_ARCO};`;
    execute.executeSQL(sqlQry, function (results) {
        execute.executeSQL(`UPDATE ARCO SET PONTO = '${results[0]['PONTO']}' WHERE ID = ${ID_ARCO}`, function (results) {
            atualizarCurtidas(io,ID_ARCO)
        });
    });
}

function atualizarCurtidas(io,ID_ARCO) {
    var sqlQry = `SELECT COUNT(*) FROM INFO_ARCO as i inner join ARCO a ON i.ID_ARCO = a.ID WHERE a.ID = ${ID_ARCO} AND i.TIPO = 1;`;
    execute.executeSQL(sqlQry, function (results) {
        execute.executeSQL(`UPDATE ARCO SET GOSTEI = '${results[0]['COUNT(*)']}' WHERE ID = ${ID_ARCO}`, function (results) {
            atualizarDenuncias(io,ID_ARCO)

        });
    });
}

function atualizarDenuncias(io,ID_ARCO) {
    var sqlQry = `SELECT COUNT(*) FROM INFO_ARCO as i inner join ARCO a ON i.ID_ARCO = a.ID WHERE a.ID = ${ID_ARCO} AND i.TIPO = 2;`;
    execute.executeSQL(sqlQry, function (results) {
        execute.executeSQL(`UPDATE ARCO SET DENUNCIA = '${results[0]['COUNT(*)']}' WHERE ID = ${ID_ARCO}`, function (results) {
            buscarArco(io, ID_ARCO)
        });
    });
}

function buscarArco(io, ARCO_ID) {
    var msg = 'ARCO' + ARCO_ID;
    var sqlQry = `SELECT 
    a.ID,
    a.TITULO AS TITULO_ARCO,
    a.ID_LIDER,
    a.PONTO,
    a.GOSTEI,
    a.DENUNCIA,
    a.SITUACAO,
    a.ID_TEMATICA,
    t.TITULO AS TITULO_TEMATICA,
    t.DESCRICAO
    FROM ARCO as a 
    inner join TEMATICA as t 
    WHERE a.ID_TEMATICA = t.ID AND a.ID = ${ARCO_ID}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            io.emit(msg, results[0]);
            io.broadcast.emit(msg, results[0]);
        }
    });
}

exports.buscar = ('/buscar/:ID', (req, res) => {
    var sqlQry = `SELECT * FROM ARCO WHERE ID = '${req.params.ID}'`;
    execute.executeSQL(sqlQry, function (results) {

        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
    });

})

exports.buscarMeusArcos = ('/buscar/:ID_USUARIO', (req, res) => {
    var sqlQry = `SELECT a.ID, t.TITULO as TEMATICA, a.TITULO, a.PONTO, a.GOSTEI 
    FROM ARCO as a 
    inner join TEMATICA as t 
    inner join EQUIPE as e
	ON a.ID_TEMATICA = t.ID 
    AND e.ID_ARCO = a.ID
    AND e.ID_USUARIO = ${req.params.ID_USUARIO}
    GROUP BY a.ID;`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
    });

})

exports.inserir = ('/inserir/:ID_TEMATICA/:TITULO/:ID_LIDER/:PONTO/:GOSTEI/:DENUNCIA/:STATUS', (req, res) => {

    const ID_TEMATICA = req.params.ID_TEMATICA;
    const TITULO = req.params.TITULO;
    const ID_LIDER = req.params.ID_LIDER;
    const PONTO = req.params.PONTO;
    const GOSTEI = req.params.GOSTEI;
    const DENUNCIA = req.params.DENUNCIA;
    const STATUS = req.params.STATUS;

    var sqlQry = `INSERT INTO USUARIO (ID_TEMATICA, TITULO, ID_LIDER, PONTO, GOSTEI, DENUNCIA, STATUS) 
    VALUES ('${ID_TEMATICA}','${TITULO}','${ID_LIDER}','${PONTO}','${GOSTEI}','${DENUNCIA}','${STATUS}')`;

    execute.executeSQL(sqlQry, function (results) {

        if (results['insertId'] > 0) {
            res.status(200).send({ results });
        } else {
            res.status(405).send(results);
        }
    });

});

exports.novoArco = ('/novoArco/:ID_TEMATICA/:ID_LIDER', (req, res) => {

    const ID_TEMATICA = req.params.ID_TEMATICA;
    const ID_LIDER = req.params.ID_LIDER;

    var sqlQry1 = `INSERT INTO ARCO (ID_TEMATICA, TITULO, ID_LIDER, PONTO, GOSTEI, DENUNCIA, SITUACAO) 
    VALUES (${ID_TEMATICA},'Defina um título!',${ID_LIDER},'0','0','0','0')`;

    execute.executeSQL(sqlQry1, function (results) {

        if (results['insertId'] > 0) {
            res.status(200).json(results.insertId);
            inserirEquipe(results['insertId'], ID_LIDER)
        } else {
            res.status(405).send(results);
        }
    });
});

function inserirEquipe(ID_ARCO, ID_LIDER) {
    var sqlQry2 = `INSERT INTO EQUIPE (ID_USUARIO, ID_ARCO) VALUES (${ID_LIDER},${ID_ARCO})`;
    execute.executeSQL(sqlQry2, function (results) {
        inserirEtapas(ID_ARCO)
    });
}

function inserirEtapas(ID_ARCO) {

    var sqlQry2 = `INSERT INTO ETAPA (CODIGO, TITULO, ID_ARCO, TEXTO, PONTO, SITUACAO) VALUES 
    ('1','OBSERVAÇÃO DA REALIDADE',${ID_ARCO},'Desenvolva sua idéia aqui...','0','1'),
    ('2','PONTOS CHAVES',${ID_ARCO},'Desenvolva sua idéia aqui...','0','0'),
    ('3','TEORIZAÇÃO',${ID_ARCO},'Desenvolva sua idéia aqui...','0','0'),
    ('4','HIPÓTESES DE SOLUÇÃO',${ID_ARCO},'Desenvolva sua idéia aqui...','0','0'),
    ('5','APLICAÇÃO A REALIDADE',${ID_ARCO},'Desenvolva sua idéia aqui...','0','0')`;

    execute.executeSQL(sqlQry2, function (results) {
    });
}

exports.listar = ('/listar', (req, res) => {
    var sqlQry = `SELECT * FROM ARCO`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
    });

})

exports.denunciarArco = ('/denunciarArco/:ID_USUARIO/:ID_ARCO/:DESCRICAO', (req, res) => {

    var sqlQry = `INSERT INTO INFO_ARCO (ID_USUARIO, ID_ARCO, DESCRICAO, TIPO)
     VALUES (${req.params.ID_USUARIO}, ${req.params.ID_ARCO}, '${req.params.DESCRICAO}','2')`;

    execute.executeSQL(sqlQry, function (results) {
        res.status(200).send(results)
    });

})

