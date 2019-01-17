'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterEquipe = require('../controllers/manterEquipe')

//rotas
router.get('/buscar/:ID', manterEquipe.buscar)
router.post('/inserir/:ID_USUARIO/:ID_ARCO/:NOME', manterEquipe.inserir)
router.get('/listar', manterEquipe.listar)

//exporta o modulo
module.exports = router