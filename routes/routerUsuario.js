'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterUsuario = require('../controllers/manterUsuario')

//rotas
router.get('/logar/:EMAIL/:SENHA', manterUsuario.logarUser)
router.route('/cadastrar/:BIO/:NOME/:SOBRENOME/:CPF/:SEXO/:DATA_NASC/:ESCOLARIDADE/:EMAIL/:SENHA/:TIPO').post(multiparty(), manterUsuario.cadastrarUser)
router.route('/alterarComFoto/:ID/:NOME/:IDADE/:SEXO/:ESCOLARIDADE').put(multiparty(), manterUsuario.alterarComFoto)

//exporta o modulo
module.exports = router

