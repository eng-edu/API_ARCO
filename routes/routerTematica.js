'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterTematica = require('../controllers/manterTematica')

//rotas

router.get('/listar', manterTematica.listar)

//exporta o modulo
module.exports = router
