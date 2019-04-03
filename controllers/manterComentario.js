
const socket = require('../serverSocket');
const execute = require('../executeSQL');


socket.on('connection', (io) => {

    io.on('COMENTARIO', function (ID_OPINIAO) {
        buscarComentarios(io, ID_OPINIAO)
    })

    io.on('MEU_COMENTARIO', function (results) {
        comentar(io, results.ID_USUARIO, results.ID_OPINIAO, results.TEXTO)
    })

});


function buscarComentarios(io, ID_OPINIAO) {
    var msg = 'COMENTARIO' + ID_OPINIAO;
    var sqlQry = `SELECT 
    c.ID_USUARIO AS ID_AUTOR, c.TEXTO, c.DATA_HORA, a.ID_LIDER
FROM
    COMENTARIO AS c
        INNER JOIN
    USUARIO AS u ON c.ID_USUARIO = u.ID
        INNER JOIN
    OPINIAO AS o ON o.ID = c.ID_OPINIAO
        INNER JOIN
    ETAPA AS e ON o.ID_ETAPA = e.ID
        INNER JOIN
    ARCO AS a ON e.ID_ARCO = a.ID
WHERE c.ID_OPINIAO = ${ID_OPINIAO}`;
    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
    });
}


function comentar(io, ID_USUARIO, ID_OPINIAO, TEXTO) {
    var DATA_HORA = require('./util').dataAtual();
    var msg = 'COMENTARIO' + ID_OPINIAO;
    var sqlQry = `INSERT INTO COMENTARIO (ID_USUARIO, ID_OPINIAO, TEXTO, DATA_HORA) VALUES (${ID_USUARIO}, ${ID_OPINIAO}, '${TEXTO}', '${DATA_HORA}')`;
    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
    });
}