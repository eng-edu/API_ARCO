
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');


socket.on('connection', (io) => {


    io.on('ESPECIALIDADE', function (results) {

        if (results.TIPO_USUARIO == 1) {

            curtidasLider(results.ID_USUARIO, results.CODIGO_ETAPA, function(x){
                estrelasLider(results.ID_USUARIO, results.CODIGO_ETAPA, function(y){
                    buscarEspecialidade(io, x[0].CURTIDAS, y[0].ESTRELAS, results.TIPO_USUARIO, results.ID_USUARIO)
                })
            })

        } else if (results.TIPO_USUARIO == 2) {
            
            curtidasMenbro(results.ID_USUARIO, results.CODIGO_ETAPA, function(x){
                estrelasMenbro(results.ID_USUARIO, results.CODIGO_ETAPA, function(y){
                    buscarEspecialidade(io, x[0].CURTIDAS, y[0].ESTRELAS, results.TIPO_USUARIO, results.ID_USUARIO)
                })
            })
        }

    })

});


function curtidasLider(ID_LIDER, CODIGO_ETAPA, callbeck) {
    var sqlQry = `SELECT 
    SUM(c.CURTIU) AS CURTIDAS
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
        INNER JOIN
    CURTIDA AS c ON o.ID = c.ID_OPINIAO
        INNER JOIN
    ARCO AS a ON a.ID = e.ID_ARCO
WHERE
    a.ID_LIDER = ${ID_LIDER} AND e.CODIGO = ${CODIGO_ETAPA}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            return callbeck(results);
        } else {
            return callbeck(results);
        }
    });
}

function estrelasLider(ID_LIDER, CODIGO_ETAPA, callbeck) {
    var sqlQry = `SELECT 
    SUM(es.QUANTIDADE) AS ESTRELAS
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
    INNER JOIN ESTRELA AS es ON o.ID = es.ID_OPINIAO
    INNER JOIN ARCO AS a ON a.ID = e.ID_ARCO
WHERE
    a.ID_LIDER = ${ID_LIDER} AND e.CODIGO = ${CODIGO_ETAPA}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            callbeck(results);
        } else {
            callbeck(results);
        }
    });
}

function curtidasMenbro(ID_USUARIO, CODIGO_ETAPA, callbeck) {
    var sqlQry = `SELECT 
    SUM(c.CURTIU) AS CURTIDAS
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
    INNER JOIN CURTIDA AS c ON o.ID = c.ID_OPINIAO
WHERE
    o.ID_USUARIO = ${ID_USUARIO} AND e.CODIGO = ${CODIGO_ETAPA}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            callbeck(results);
        } else {
            callbeck(results);
        }
    });
}

function estrelasMenbro(ID_USUARIO, CODIGO_ETAPA, callbeck) {
    var sqlQry = `SELECT 
    SUM(es.QUANTIDADE) AS ESTRELAS
FROM
    OPINIAO AS o
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
    INNER JOIN ESTRELA AS es ON o.ID = es.ID_OPINIAO
WHERE
    o.ID_USUARIO = ${ID_USUARIO} AND e.CODIGO = ${CODIGO_ETAPA}`;
    execute.executeSQL(sqlQry, function (results) {
        if (results.length > 0) {
            callbeck(results);
        } else {
            callbeck(results);
        }
    });
}

function buscarEspecialidade(io, CURTIDAS, ESTRELAS, TIPO_USUARIO, ID_USUARIO) {
    var sqlQry = `SELECT * FROM ESPECIALIDADE WHERE CURTIDAS <= ${CURTIDAS} AND ESTRELAS <= ${ESTRELAS} AND TIPO_USUARIO = ${TIPO_USUARIO} HAVING MAX(ID)`;
    execute.executeSQL(sqlQry, function (results) {
        var msg = 'ESPECIALIDADE' + ID_USUARIO;
        io.emit(msg, results[0]);
        io.broadcast.emit(msg, results[0]);
    });
}