var fs = require('fs');
const execute = require('../executeSQL');

module.exports = function (req, res) {


	res.setHeader("Access-Control-Allow-Origin", "*");
	var temporario = req.files.file.path;

	const NOME = req.files.file.name;
	var CAMINHO = ""
	const ETAPA_ID = req.params.ETAPA_ID
	const ARCO_ID = req.params.ARCO_ID

	var sqlQry1 = `INSERT INTO GENERATE_ID (NAME) VALUES ('${NOME}')`;

	gerarId()

	function gerarId() {
		execute.executeSQL(sqlQry1, function (results) {

			if (results['insertId'] > 0) {
				CAMINHO = './uploads/' + results['insertId'] + "_documento.pdf"
				fs.rename(temporario, CAMINHO, function (err) {
					inserirArquivo()
				})
			} 

			console.log(results);
		});
	}


	function inserirArquivo() {

		var sqlQry2 = `INSERT INTO DOCUMENTO (NOME, CAMINHO, ETAPA_ID, ARCO_ID) VALUES ('${NOME}','${CAMINHO}','${ETAPA_ID}','${ARCO_ID}')`;

		execute.executeSQL(sqlQry2, function (results) {

			if (results['insertId'] > 0) {
				res.status(201).send(results);
			} else {
				res.status(405).send(results);
			}
			console.log(results);
		});
	}


}