'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterEquipe = require('../controllers/manterEquipe')

//rotas
router.get('/buscar/:ID_ARCO', manterEquipe.buscar)
router.post('/inserirMenbro/:CODIGO/:ID_USUARIO/', manterEquipe.inserirMenbro)
router.delete('/removerMenbro/:ID_USUARIO', manterEquipe.removerMenbro)
router.get('/listar', manterEquipe.listar)
router.get('/teste', manterEquipe.teste)
router.put('/aceitarSolicitacao/:CODIGO/:ID_USUARIO', manterEquipe.aceitarSolicitacao)
router.put('/recusarSolicitacao/:CODIGO/:ID_USUARIO', manterEquipe.recusarSolicitacao)

//exporta o modulo
module.exports = router