'use strict';
const _ = require('lodash');
const config = require('./environment/index');
const requestPromise = require('request-promise'),
      syncRequest = require('sync-request');
const CEP_SIZE = 8,
      VIACEP_URI = config.apiViaCep.url;

const callViaCep = cep => {
  let requestOptions = {
    json: true,
    uri: `${VIACEP_URI}/ws/${cep}/json`
  };

  return requestPromise(requestOptions);
}

const invalidCep = cep => {
  return !cep || !isStringOrNumber(cep) || cep.toString().length !== CEP_SIZE;
}

const isStringOrNumber = value => {
  return typeof value === 'string' || value instanceof String || !isNaN(value);
}

const getValidationMessage = () => {
  return `The CEP should be a number or string of size ${CEP_SIZE}. Please check your parameter.`;
}

const getData = cep => {
  let ret;
  let jsonApi;
  try {
    if (invalidCep(cep)) {
      throw new Error(getValidationMessage());
    }
    ret = syncRequest('GET', `${VIACEP_URI}/ws/${cep}/json`);
    jsonApi = JSON.parse(ret.getBody());
	ret = {
      	zipcode: jsonApi.cep,
        street: jsonApi.logradouro,
        street_number: jsonApi.complemento,
        neighborhood: jsonApi.bairro,
        city: jsonApi.localidade,
        state: jsonApi.uf,
        ibge: jsonApi.ibge
    };
  } catch(e) {
    ret = {
      hasError: true,
      statusCode: e.statusCode,
      message: e.message
    };
  }

  return ret;
}

module.exports = function getDetailsByZipCode (cep) {
  if (!_.isEmpty(cep) && isNaN(cep)) {
    cep = cep.replace(/[-\s]/g, '');
  }
  return  getData(cep);
};

