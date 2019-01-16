'use strict';

const express = require('express')
const router = express.Router()

//controller
const manterDocumento = require('../controllers/manterDocumento')

//rotas
router.get('/buscarArquivos/:ETAPA_ID', manterDocumento.get)
router.post('/:JSON', manterDocumento.post)
router.put('/:ID/:NOME/:CAMINHO/:ETAPA_ID/:ETAPA_ARCO_ID', manterDocumento.put)
router.delete('/apagarArquivosEtapa/:ID', manterDocumento.delet)





//exporta o modulo
module.exports = router

