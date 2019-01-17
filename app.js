
//modulos
const express = require('express');
const app = express();
const mysql = require('mysql');

//chama os modulos das rotas
const indexRoute = require('./routes/index')
const usuarioRoute = require('./routes/routerUsuario')

//configura conexao com banco
exports.connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '6code384',
  database: 'BD'
});


//ver imagem
app.get('/IMG/:NAME', function (req, res) {
  var filePath = "/uploads/" + req.params.NAME;
  console.log("chamou arquivo: " + req.params.NAME)
  var fs = require('fs')
  fs.readFile(__dirname + filePath, function (err, data) {
    res.contentType("image/jpg");
    res.send(data);
  });
});


//ver pdf link
app.get('/PDF/:NAME', function (req, res) {
  var filePath = "/uploads/" + req.params.NAME;
  console.log("chamou arquivo: " + req.params.NAME)
  var fs = require('fs')
  fs.readFile(__dirname + filePath, function (err, data) {
    res.contentType("application/pdf");
    res.send(data);
  });
});


//carregando rotas
app.use('/index', indexRoute);
app.use('/usuario', usuarioRoute)
app.use(express.static('uploads'));


//exporta o modulo
module.exports = app;