'use strict';

const BD = require('./app');

//função que raliza execução das querys de forma assyncrona no banco de dados
exports.executeSQL = function(stringSQL, callbeck){
   
    BD.connection.query(stringSQL, function(error, results, fields){
    
        var rows;

        if(error) {
            console.log(error)
            rows = JSON.parse(JSON.stringify(error));
            callbeck(rows);
          //  console.log(rows);

        }else{
            
            rows = JSON.parse(JSON.stringify(results));
            callbeck(rows);
        }

       
      console.log("executou SQL:" + stringSQL);
    });
    
    
}