'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');


//controller
const manterDocente = require('../controllers/manterUsuario')

//rotas
router.get('/buscar/:ID', manterDocente.buscar)
router.route('/inserir/:NOME/:IDADE/:FOTO/:SEXO/:ESCOLARIDADE/:EMAIL/:SENHA').post(multiparty(), manterDocente.inserir)
router.get('/listar', manterDocente.listar)

//exporta o modulo
module.exports = router

