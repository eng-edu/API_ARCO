'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterEquipe = require('../controllers/manterEquipe')

//rotas
router.get('/buscar/:ID_ARCO', manterEquipe.buscar)
router.post('/inserirMenbro/:CODIGO/:ID_USUARIO/', manterEquipe.inserirMenbro)
router.delete('/removerMenbro/:CODIGO/:ID_USUARIO', manterEquipe.removerMenbro)
router.put('/aceitarSolicitacao/:CODIGO/:ID_USUARIO', manterEquipe.aceitarSolicitacao)
router.put('/recusarSolicitacao/:CODIGO/:ID_USUARIO', manterEquipe.recusarSolicitacao)

//exporta o modulo
module.exports = router