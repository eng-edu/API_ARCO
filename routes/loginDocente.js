'use strict';

const execute = require('../executeSQL');
const express = require('express');
const tokenAPI = require('../token');

const router = express.Router();
//rota principal, raiz da aplicação
router.get('/:EMAIL/:SENHA', (req, res, next) => { 
    
    const EMAIL = req.params.EMAIL;
    const SENHA = req.params.SENHA;

    var sqlQry1 = `SELECT * FROM DOCENTE WHERE EMAIL = '${EMAIL}' AND SENHA = '${SENHA}'`;
   
    execute.executeSQL(sqlQry1, function(results){
       
        try{

            var count = Object.keys(results).length;
    
            if(count != 0){
     
                res.status(200).send({

                    ID: results[0]['ID'],
                    FORMACAO: results[0]['FORMACAO'],
                    NOME: results[0]['NOME'],
                    EMAIL: results[0]['EMAIL'],
                    SENHA: results[0]['SENHA'],
                    FOTO: results[0]['FOTO'],
                    TOKENAPI : tokenAPI
                });

            }else{
        
            res.status(203).send('Dados incoretos');
       
            }

        }catch(ex){
            res.status(203).send('Dados incoretos');
        }

    });

});

module.exports = router;