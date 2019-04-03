
'use strict';

const express = require('express');
const router = express.Router();

//rota principal, raiz da aplicação
router.get('/', (req, res) => { 
    res.status(200).send({
       title: 'API NodeJs - SISTEMA ARCO',
       version: '2.0',
       developer: 'Eduardo lima, Hugo henrique, Vívian souza',
       email: '6code384@gmail.com'
    });
});

module.exports = router;
