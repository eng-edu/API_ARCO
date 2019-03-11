'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterEquipe = require('../controllers/manterNotificacao')

//rotas
router.get('/buscar/:ID_ARCO', manterEquipe.buscar)


//exporta o modulo
module.exports = router