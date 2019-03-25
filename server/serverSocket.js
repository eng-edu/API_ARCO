'use strict';

const io = require('socket.io')();
const execute = require('../executeSQL');


io.on('connection', (socket) => {
   // console.log('conectou: ' + socket.id)

   // console.log('id_usuario: ' + socket.handshake.query.ID_USUARIO)

    var sqlQry = `UPDATE USUARIO SET ONLINE = 1 WHERE ID = ${socket.handshake.query.ID_USUARIO}`;
    execute.executeSQL(sqlQry, function (results) {
 
       socket.emit('ON'+socket.handshake.query.ID_USUARIO, '1');
       socket.broadcast.emit('ON'+socket.handshake.query.ID_USUARIO, '1');

    });

    socket.on('disconnect', function () {
       // console.log('desconectou: ' + socket.id)
       // console.log('id_usuario: ' + socket.handshake.query.ID_USUARIO)
        var sqlQry = `UPDATE USUARIO SET ONLINE = 0 WHERE ID = ${socket.handshake.query.ID_USUARIO}`;
        execute.executeSQL(sqlQry, function (results) {
            socket.emit('ON'+socket.handshake.query.ID_USUARIO, '0');
            socket.broadcast.emit('ON'+socket.handshake.query.ID_USUARIO, '0');
        });
    });
});

module.exports = io;