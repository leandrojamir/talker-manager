// iniciando projeto
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// 1 - Crie o endpoint GET /talker
// requisição deve retornar o status 200 e um array com todas as pessoas palestrantes cadastradas.
app.get('/talker', async (_req, res) => {
  const pathTalker = path.resolve(__dirname, 'talker.json');
  const talker = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  // Caso não exista nenhuma pessoa palestrante cadastrada a requisição deve retornar o status 200 e um array vazio.
  const result = talker.length === 0 ? [] : talker;
  res.status(200).json(result);
});

app.listen(PORT, () => {
  console.log('Online');
});
