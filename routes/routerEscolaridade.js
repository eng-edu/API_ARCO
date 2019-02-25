'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterEscolaridade= require('../controllers/manterEscolaridade')

//rotas
router.get('/buscarEscolaridade/:ID_USUARIO', manterEscolaridade.buscarEscolaridade)

//exporta o modulo
module.exports = router

