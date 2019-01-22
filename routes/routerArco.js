'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');


//controller
const manteArco = require('../controllers/manterArco')

//rotas
router.get('/buscar/:ID', manteArco.buscar)
router.post('/inserir/:ID_TEMATICA/:TITULO/:ID_LIDER/:PONTO/:GOSTEI/:DENUNCIA/:STATUS', manteArco.inserir)
router.post('/novoArco/:ID_TEMATICA/:ID_LIDER', manteArco.novoArco)
router.get('/listar', manteArco.listar)

//exporta o modulo
module.exports = router
