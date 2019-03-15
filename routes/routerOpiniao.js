'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterOpiniao = require('../controllers/manterOpiniao')

//rotas
router.post('/novaOpiniao/:ID_LIDER/:ID_TEMATICA', manterOpiniao.novaOpiniao)


//exporta o modulo
module.exports = router
