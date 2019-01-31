'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');


//controller
const manteArco = require('../controllers/manterArco')

//rotas
router.get('/buscar/:ID', manteArco.buscar)
router.get('/buscarMeusArcos/:ID_USUARIO', manteArco.buscarMeusArcos)
router.post('/inserir/:ID_TEMATICA/:TITULO/:ID_LIDER/:PONTO/:GOSTEI/:DENUNCIA/:STATUS', manteArco.inserir)
router.post('/novoArco/:ID_TEMATICA/:ID_LIDER', manteArco.novoArco)
router.post('/denunciarArco/:ID_USUARIO/:ID_ARCO/:DESCRICAO', manteArco.denunciarArco)
router.get('/listar', manteArco.listar)
router.get('/buscarArcosComaprtilhados', manteArco.buscarArcosComaprtilhados)
router.get('/buscarRanking', manteArco.buscarRanking)
router.get('/gerarmedia/:list', manteArco.gerarmedia)
//exporta o modulo
module.exports = router
