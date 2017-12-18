
var express = require('express');
var app = express();
var buscaCep = require('./index.js');

app.get('/', function (req, res) {
  res.send('Consulta CEP - para encontrar seu cep utilize : /api/v1/cep/code=:cep');
});

app.get('/api/v1/cep/code=:cep', function (req, res) {
	var resposta = buscaCep(req.params.cep, true);
 	res.send(resposta);
});

app.use(function(req, res) {
 res.send('404: Page not Found', 404);
});

app.use(function(error, req, res, next) {
 res.send('500: Internal Server Error', 500);
});

app.use(function(error, req, res, next) {
 res.send('400: Bad Request', 400);
});
 
app.listen(3000, function () {
  console.log('App running on port 3000!');
});