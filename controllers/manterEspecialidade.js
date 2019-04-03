

const socket = require('../serverSocket');
const execute = require('../executeSQL');


socket.on('connection', (io) => {


    io.on('ESPECIALIDADE', function (results) {


        execute.executeSQL(`SELECT TIPO AS TIPO_USUARIO FROM USUARIO WHERE ID = ${results.ID_USUARIO}`, function (resultQuery) {

            if (resultQuery.length > 0) {

                if (resultQuery[0].TIPO_USUARIO == 1) {

                    curtidasLider(results.ID_USUARIO, results.CODIGO_ETAPA, function (x) {
                        estrelasLider(results.ID_USUARIO, results.CODIGO_ETAPA, function (y) {
                            buscarEspecialidade(io, x[0].CURTIDAS, y[0].ESTRELAS, resultQuery[0].TIPO_USUARIO, results.ID_USUARIO, results.CODIGO_ETAPA)
                        })
                    })

                } else if (resultQuery[0].TIPO_USUARIO == 2) {

                    curtidasMenbro(results.ID_USUARIO, results.CODIGO_ETAPA, function (x) {
                        estrelasMenbro(results.ID_USUARIO, results.CODIGO_ETAPA, function (y) {
                            buscarEspecialidade(io, x[0].CURTIDAS, y[0].ESTRELAS, resultQuery[0].TIPO_USUARIO, results.ID_USUARIO, results.CODIGO_ETAPA)
                        })
                    })
                }

            }

        });

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
    a.ID_LIDER = ${ID_LIDER} AND e.CODIGO = ${CODIGO_ETAPA}  AND c.CURTIU = 1`;
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
    o.ID_USUARIO = ${ID_USUARIO} AND e.CODIGO = ${CODIGO_ETAPA} AND c.CURTIU = 1`;
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

function buscarEspecialidade(io, CURTIDAS, ESTRELAS, TIPO_USUARIO, ID_USUARIO, CODIGO_ETAPA) {

    for (var i = 0; i > 5; i++) { }
    var sqlQry = `SELECT * FROM ESPECIALIDADE WHERE CURTIDAS <= ${CURTIDAS} AND ESTRELAS <= ${ESTRELAS} AND TIPO_USUARIO = ${TIPO_USUARIO} HAVING MAX(ID)`;
    execute.executeSQL(sqlQry, function (results) {
        var msg = 'ESPECIALIDADE' + ID_USUARIO + "_" + CODIGO_ETAPA;

        if (results.length > 0) {
            results[0].ESTRELAS = ESTRELAS
            results[0].CURTIDAS = CURTIDAS
            io.emit(msg, results[0]);
            io.broadcast.emit(msg, results[0]);


            execute.executeSQL(`SELECT * FROM ESPECIALIDADE_DO_USUARIO WHERE ID_USUARIO = ${ID_USUARIO} AND CODIGO_ETAPA = ${CODIGO_ETAPA}`, function (results2) {

                if (results2.length > 0) {
                    execute.executeSQL(`UPDATE ESPECIALIDADE_DO_USUARIO SET ID_ESPECIALIDADE = ${results[0].ID}, CURTIDAS = ${results[0].CURTIDAS}, ESTRELAS = ${results[0].ESTRELAS} WHERE ID_USUARIO = ${ID_USUARIO} AND CODIGO_ETAPA = ${CODIGO_ETAPA} `, function (results3) { });
               } else {
                    execute.executeSQL(`INSERT INTO ESPECIALIDADE_DO_USUARIO (ID_USUARIO, ID_ESPECIALIDADE, CURTIDAS, ESTRELAS, CODIGO_ETAPA) VALUES (${ID_USUARIO}, ${results[0].ID}, ${results[0].CURTIDAS}, ${results[0].ESTRELAS}, ${CODIGO_ETAPA})`, function (results) { });
                }

            });

        }

    })






}