'use strict';

const express = require('express')
const router = express.Router()

//controller
const manterArco = require('../controllers/manterArco')

//rotas
router.get('/buscarArcoDiscente/:DISCENTE_ID/', manterArco.buscarArcoDiscente) 
router.post('/novoArco/:JSON/', manterArco.novoArco)
router.put('/compartilharArco/:ID/:COMPARTILHADO/', manterArco.compartilharArco)
router.delete('/excluirArco/:ID/', manterArco.excluirArco)
router.get('/bucarArcosCompartilhados/', manterArco.bucarArcosCompartilhados) 
router.get('/buscarArcoDocente/:DOCENTE_ID/', manterArco.buscarArcoDocente)


//exporta o modulo
module.exports = router

