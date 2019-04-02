'use strict';

const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

//controller
const manterUsuario = require('../controllers/manterEspecialidade')
//exporta o modulo
module.exports = router

