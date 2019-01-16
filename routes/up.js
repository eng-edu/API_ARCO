const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty');

router.route('/upload/:ETAPA_ID/:ARCO_ID').post(multiparty(), require('../controllers/controllerUp'));

module.exports = router

