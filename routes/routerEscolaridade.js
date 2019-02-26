'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterEscolaridade= require('../controllers/manterEscolaridade')

//id_usuario, instituicao, area, ano, grupos, descricao,

//rotas
router.get('/buscarEscolaridade/:ID_USUARIO', manterEscolaridade.buscarEscolaridade)
router.route('/alterarComFoto/:ID_USUARIO/:INSTITUICAO/:AREA/:ANO/:GRUPOS/:DESCRICAO').put(multiparty(), manterEscolaridade.alterarComFoto)
router.put('/alterar/:ID_USUARIO/:INSTITUICAO/:AREA/:ANO/:GRUPOS/:DESCRICAO', manterEscolaridade.alterar)

//exporta o modulo
module.exports = router

