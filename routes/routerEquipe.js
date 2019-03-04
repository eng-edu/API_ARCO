'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterEquipe = require('../controllers/manterEquipe')

//rotas
router.get('/buscar/:ID_ARCO', manterEquipe.buscar)
router.post('/inserirMenbro/:ID_ARCO/:ID_USUARIO/:NOME', manterEquipe.inserirMenbro)
router.delete('/removerMenbro/:ID_USUARIO', manterEquipe.removerMenbro)
router.get('/listar', manterEquipe.listar)

//exporta o modulo
module.exports = router