'use strict';

const socket = require('../server/serverSocket');
const execute = require('../executeSQL');

socket.on('connection', (io) => {

    io.on('ARCO', function (MSG) {

        var sqlQry = `SELECT * FROM INFO_ARCO WHERE ID_ARCO = ${MSG.ID_ARCO} AND ID_USUARIO = ${MSG.ID_USUARIO};`;

        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
                buscarCurtidas(io, MSG.ID_ARCO, 'S')
            } else {
                buscarCurtidas(io, MSG.ID_ARCO, 'N')
            }
        });


    })

    io.on('TITULO', function (MSG) {

        var sqlQry = `UPDATE ARCO SET TITULO = '${MSG}';`;

        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
                console.log(results)
            }
        });


    })

    io.on('GOSTEI', function (MSG) {

        var sqlQry = `INSERT INTO INFO_ARCO (ID_USUARIO, ID_ARCO, TIPO) 
            VALUES ('${MSG.ID_USUARIO}','${MSG.ID_ARCO}','1');`;

        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
                console.log(results)
            }
        });


    })

    io.on('ETAPA', function (MSG) {

        var sqlQry = `SELECT * FROM ETAPA WHERE ID_ARCO = ${MSG.ID_ARCO};`;

        execute.executeSQL(sqlQry, function (results) {
            if (results.length > 0) {
                io.emit(msg, results);
                io.broadcast.emit(msg, results);
            }
        });


    })

});

function buscarCurtidas(io, ID_ARCO, EU_GOSTEI) {

    var sqlQry = `SELECT COUNT(*) FROM INFO_ARCO as i inner join ARCO a ON i.ID_ARCO = a.ID WHERE a.ID = ${ID_ARCO};`;

    execute.executeSQL(sqlQry, function (results) {
        buscarArco(io, ID_ARCO, EU_GOSTEI, results[0]['COUNT(*)'])
        execute.executeSQL(`UPDATE ARCO SET GOSTEI = '${results[0]['COUNT(*)']}'`, function (results) { });
    });
}

function buscarArco(io, ARCO_ID, EU_GOSTEI, GOSTEI) {
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
            results[0].EU_GOSTEI = EU_GOSTEI
            results[0].GOSTEI = GOSTEI
            io.emit(msg, results[0]);
            io.broadcast.emit(msg, results[0]);
            console.log(results[0])
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
        console.log(results)
    });

})

exports.buscarMeusArcos = ('/buscar/:ID_USUARIO', (req, res) => {
    var sqlQry = `SELECT 
    a.ID, t.TITULO as TEMATICA, a.TITULO, a.PONTO, a.GOSTEI 
    FROM ARCO as a 
    inner join TEMATICA as t 
    inner join EQUIPE as e
    WHERE a.ID_TEMATICA = t.ID 
    AND e.ID_ARCO = a.ID
    AND e.ID_USUARIO = '${req.params.ID_USUARIO}'`;

    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            res.status(200).send(results)
        } else {
            res.status(405).send(results);
        }
        console.log(results)
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
        console.log(results);
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
        console.log(results.insertId);
    });



});

function inserirEquipe(ID_ARCO, ID_LIDER) {
    
    var sqlQry2 = `INSERT INTO EQUIPE (ID_USUARIO, ID_ARCO) VALUES (${ID_LIDER},${ID_ARCO})`;

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
        console.log(results)
    });

})

/**

contagem das curtidas...
SELECT COUNT(TIPO)
FROM info_arco where TIPO = 1 AND ID_ARCO = 1;

saber se eu curti esse arco
select * from info_arco where ID_USUARIO = 3;

arco com tematica

SELECT

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

WHERE a.ID_TEMATICA = t.ID ;

verificar a curtida
SELECT COUNT(*) FROM INFO_ARCO WHERE ID_ARCO = 1 AND ID_USUARIO = 1;


*/