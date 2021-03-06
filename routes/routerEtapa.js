'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterEtapa = require('../controllers/manterEtapa')

//rotas
router.get('/buscarEtapa/:ID_ETAPA', manterEtapa.buscarEtapa)
router.put('/finalizarEtapa/:ID/:CODIGO', manterEtapa.finalizarEtapa)

//exporta o modulo
module.exports = router
