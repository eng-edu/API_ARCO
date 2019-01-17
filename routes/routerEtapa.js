'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');


//controller
const manterEtapa = require('../controllers/manterEtapa')

//rotas
router.get('/buscar/:ID', manterEtapa.buscar)
router.post('/inserir/:CODIGO/:TITULO/:ID_ARCO/:TEXTO/:PONTO/:STATUS', manterEtapa.inserir)
router.get('/listar', manterEtapa.listar)

//exporta o modulo
module.exports = router
