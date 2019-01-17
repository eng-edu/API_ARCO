'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');


//controller
const manteArco = require('../controllers/manterArco')

//rotas
router.get('/buscar/:ID', manteArco.buscar)
router.post('/inserir/:ID_TEMATICA/:TITULO/:ID_LIDER/:PONTO/:LIKE/:DESLAIKE/:DENUNCIA/:STATUS', manterDocente.inserir)
router.get('/listar', manterDocente.listar)

//exporta o modulo
module.exports = router
