'use strict';

const express = require('express')
const router = express.Router()

//controller
const manterEtapa = require('../controllers/manterEtapa')

//rotas
router.put('/salvarEtapa/:ID/:RESUMO', manterEtapa.put1)
router.put('/submeterEtapa/:ID/:RESUMO', manterEtapa.put2)
router.put('/aprovarEtapa/:ID/:PROX_ID/:ARCO_ID', manterEtapa.put3)
router.put('/reprovarEtapa/:ID', manterEtapa.put4)
router.get('/listarEtapasArco/:ARCO_ID', manterEtapa.get5)

//exporta o modulo
module.exports = router

