'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterUsuario = require('../controllers/manterUsuario')

//rotas
router.get('/logar/:EMAIL/:SENHA', manterUsuario.logarUser)
router.route('/cadastrar/:BIO/:NOME/:SOBRENOME/:CPF/:SEXO/:DATA_NASC/:ESCOLARIDADE/:EMAIL/:SENHA/:TIPO').post(multiparty(), manterUsuario.cadastrarUser)
router.post('/recuperarSenha/:EMAIL/:DATA_NASC', manterUsuario.recuperarSenha)
router.get('/buscarUsuario/:ID', manterUsuario.buscarUsuario)
router.route('/alterarComFoto/:ID/:BIO/:NOME/:SOBRENOME/:CPF/:SEXO/:DATA_NASC/:ESCOLARIDADE/').put(multiparty(), manterUsuario.alterarComFoto)
router.post('/alterar/:ID/:BIO/:NOME/:SOBRENOME/:CPF/:SEXO/:DATA_NASC/:ESCOLARIDADE/', manterUsuario.alterar)

//exporta o modulo
module.exports = router

