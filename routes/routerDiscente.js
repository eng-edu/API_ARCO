'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');


//controller
const manterDiscente = require('../controllers/manterDiscente')

//rotas
router.get('/buscar/:ID', manterDiscente.buscar)
router.route('/inserir/:NOME/:INSTITUICAO/:EMAIL/:SENHA').post(multiparty(), manterDiscente.inserir)
router.put('/modificar/:ID/:NOME/:INSTITUICAO/:EMAIL/:SENHA', manterDiscente.modificar)
router.delete('/deletar/:ID', manterDiscente.deletar)
router.get('/listar', manterDiscente.listar)

//exporta o modulo
module.exports = router

