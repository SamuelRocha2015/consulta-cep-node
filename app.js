
var express = require('express');
var app = express();
var buscaCep = require('./index.js');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/v1/cep/code=:cep', function (req, res) {
  	var resposta = buscaCep(req.params.cep, true);
 	res.send(resposta);
});

app.listen(3000, function () {
  console.log('App running on port 3000!');
});