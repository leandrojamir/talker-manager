// iniciando projeto
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

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

// 2 - Crie o endpoint GET /talker/:id
// A requisição deve retornar o status 200 e uma pessoa palestrante com base no id da rota.
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const pathTalker = path.resolve(__dirname, 'talker.json');
  const talker = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  const talkerID = talker.find((element) => Number(element.id) === Number(id));
  // Caso não seja encontrada uma pessoa palestrante com base no id da rota, a requisição deve retornar o status 404 com o seguinte corpo:
  // {
  //   "message": "Pessoa palestrante não encontrada"
  // }
  
  // (!talkerID) ? res.status(404).json({ message: 'Pessoa palestrante não encontrada' }) : res.status(200).json(talkerID);
  if (!talkerID) {
    return res.status(404).json(
      { 
        message: 'Pessoa palestrante não encontrada', 
      },
    );
  }
  return res.status(200).json(talkerID);
});

// 3 - Crie o endpoint POST /login
// O endpoint deverá receber no corpo da requisição os campos email e password e retornar um token aleatório de 16 caracteres. Este token será utilizado pelas requisições dos próximos requisitos do projeto.
// O corpo da requisição deverá ter seguinte formato:
// {
//   "email": "email@email.com",
//   "password": "123456"
// }
// Os seguintes pontos serão avaliados:
// O endpoint deverá retornar um código de status 200 com o token gerado e o seguinte corpo:
// {
//   "token": "7mqaVRXJSp886CGr"
// }
// O endpoint deve retornar um token aleatório a cada vez que for acessado.

// https://levitrares.com/host-https-qastack.com.br/programming/8855687/secure-random-token-in-node-js
// https://nodejs.org/api/crypto.html#cryptorandombytessize-callback
app.post('/login', (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  const { email, password } = req.body;

  if (email && password) {
    res.status(200).json({ token });
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
