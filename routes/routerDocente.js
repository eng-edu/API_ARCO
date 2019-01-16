'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');


//controller
const manterDocente = require('../controllers/manterDocente')

//rotas
router.get('/buscar/:ID', manterDocente.buscar)
router.route('/inserir/:NOME/:FORMACAO/:EMAIL/:SENHA').post(multiparty(), manterDocente.inserir)
router.put('/modificar/:ID/:NOME/:FORMACAO/:EMAIL/:SENHA', manterDocente.modificar)
router.delete('/deletar/:ID', manterDocente.deletar)
router.get('/listar', manterDocente.listar)
router.put('/aceitarSolicitacao/:ID/:ARCO_ID/', manterDocente.aceitarSolicitacao)
router.get('/buscarSolicitacoes/', manterDocente.buscarSolicitacoes)

//exporta o modulo
module.exports = router

