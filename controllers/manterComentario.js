
const socket = require('../server/serverSocket');
const execute = require('../executeSQL');


socket.on('connection', (io) => {
    
    io.on('COMENTARIO', function (ID_OPINIAO) {    
       buscarComentarios( io,ID_OPINIAO)
    })

    io.on('MEU_COMENTARIO', function (results) { 


    })

});


function buscarComentarios(io, ID_OPINIAO) {
    var msg = 'COMENTARIO' + ID_OPINIAO;
    var sqlQry = `SELECT c.ID_USUARIO AS ID_AUTOR, u.EMAIL AS EMAIL_AUTOR, c.TEXTO, c.DATA_HORA FROM COMENTARIO AS c INNER JOIN USUARIO AS u ON c.ID_USUARIO = u.ID WHERE ID_OPINIAO = '${ID_OPINIAO}'`;
    execute.executeSQL(sqlQry, function (results) {
        io.emit(msg, results);
        io.broadcast.emit(msg, results);
    });
}
