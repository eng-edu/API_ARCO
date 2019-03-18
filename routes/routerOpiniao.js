'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterOpiniao = require('../controllers/manterOpiniao')

//rotas
router.get('/buscarOpiniao/:ID_USUARIO/:ID_ETAPA', manterOpiniao.buscarOpiniao2)
router.put('/atualizarOpiniao/:ID_USUARIO/:ID_ETAPA/:TEXTO', manterOpiniao.atualizarOpiniao)




//exporta o modulo
module.exports = router
