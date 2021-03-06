
//modulos
const express = require('express');
const app = express();
const mysql = require('mysql');


//configura conexao com banco
exports.connection = mysql.createConnection({
  host: '191.252.186.65',
  port: '3306',
  user: 'root',
  password: '6code384',
  database: 'base_argio',
  charset: 'latin1_swedish_ci'
});

//ver imagem
app.get('/IMG/:NAME', function (req, res) {
  var filePath = "/uploads/" + req.params.NAME;
 // console.log("chamou arquivo: " + req.params.NAME)
  var fs = require('fs')
  fs.readFile(__dirname + filePath, function (err, data) {
    res.contentType("image/jpg");
    res.send(data);
  });
});

//ver pdf link
app.get('/PDF/:NAME', function (req, res) {
  var filePath = "/uploads/" + req.params.NAME;
 // console.log("chamou arquivo: " + req.params.NAME)
  var fs = require('fs')
  fs.readFile(__dirname + filePath, function (err, data) {
    res.contentType("application/pdf");
    res.send(data);
  });
});


//carregando rotas
app.use('/index', require('./routes/index'));
app.use('/usuario', require('./routes/routerUsuario'))
app.use('/escolaridade', require('./routes/routerEscolaridade'))
app.use('/tematica', require('./routes/routerTematica'))
app.use('/arco', require('./routes/routerArco'))
app.use('/etapa', require('./routes/routerEtapa'))
app.use('/equipe', require('./routes/routerEquipe'))
app.use('/notificacao', require('./routes/routerNotificacao'))
app.use('/opiniao', require('./routes/routerOpiniao'))
app.use('/comentario', require('./routes/routerComentario'))
app.use('/especialidade', require('./routes/routerEspecialidade'))
app.use(express.static('uploads'));

//exporta o modulo
module.exports = app;