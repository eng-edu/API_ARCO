'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');


//controller
const manteArco = require('../controllers/manterArco')

//rotas
router.get('/buscarTodosArcos/', manteArco.buscarTodosArcos)
router.get('/buscarMeusArcos/:ID_USUARIO', manteArco.buscarMeusArcos)
router.post('/novoArco/:ID_LIDER/:ID_TEMATICA', manteArco.novoArco)
//exporta o modulo
module.exports = router
