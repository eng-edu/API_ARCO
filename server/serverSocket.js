'use strict';

const io = require('socket.io')();
io.on('connection',(socket)=>{
    console.log('conectou' + socket.id)
    socket.on('disconnect', function(){

    });
});

module.exports = io;