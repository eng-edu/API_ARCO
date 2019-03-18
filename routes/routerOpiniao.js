'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterOpiniao = require('../controllers/manterOpiniao')

//rotas
router.post('/novaOpiniao/:ID_LIDER/:ID_TEMATICA', manterOpiniao.novaOpiniao)
//rotas
router.get('/buscarOpiniao/:ID_USUARIO/:ID_ETAPA', manterOpiniao.buscarOpiniao2)



//exporta o modulo
module.exports = router
