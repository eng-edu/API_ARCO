'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');


//controller
const manterUsuario = require('../controllers/manterUsuario')

//rotas
router.get('/buscarUsuarioEmailSenha/:EMAIL/:SENHA', manterUsuario.buscarUsuarioEmailSenha)
router.get('/buscar/:ID', manterUsuario.buscar)
router.route('/inserir/:NOME/:IDADE/:SEXO/:ESCOLARIDADE/:EMAIL/:SENHA/:TIPO').post(multiparty(), manterUsuario.inserir)
router.route('/alterarComFoto/:ID/:NOME/:IDADE/:SEXO/:ESCOLARIDADE').put(multiparty(), manterUsuario.alterarComFoto)
router.put('/alterar/:ID/:NOME/:IDADE/:SEXO/:ESCOLARIDADE', manterUsuario.alterar)
router.post('/novoMenbro/:ID_USUARIO/:ID_ARCO', manterUsuario.novoMenbro)
router.get('/listar', manterUsuario.listar)

//exporta o modulo
module.exports = router

