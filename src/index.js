// terminar esse projeto em uma página proposital e voltar nele depois para aplicar MSC
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const { validarToken, validarNome, validarIdade, validarTalk,
  validarWatchedAt, validarRate } = require('./service/talker.service');
const { validarLogin1, validarLogin2 } = require('./service/login.service');
const { validarDelete } = require('./service/token.service');

const app = express();
app.use(bodyParser.json());
const pathTalker = path.resolve(__dirname, 'talker.json');

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// 1 - Crie o endpoint GET /talker
// requisição deve retornar o status 200 e um array com todas as pessoas palestrantes cadastradas.
app.get('/talker', async (_req, res) => {
  const talker = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  // Caso não exista nenhuma pessoa palestrante cadastrada a requisição deve retornar o status 200 e um array vazio.
  const result = talker.length === 0 ? [] : talker;
  res.status(200).json(result);
});

// 2 - Crie o endpoint GET /talker/:id
// A requisição deve retornar o status 200 e uma pessoa palestrante com base no id da rota.
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
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

// 4 - Adicione as validações para o endpoint /login
// Os campos recebidos pela requisição devem ser validados e, caso os valores sejam inválidos, o endpoint deve retornar o código de status 400 com a respectiva mensagem de erro ao invés do token.
// As regras de validação são:
// o campo email é obrigatório;
// o campo email deve ter um email válido;
// o campo password é obrigatório;
// o campo password deve ter pelo menos 6 caracteres.
// Os seguintes pontos serão avaliados:
// mudando validacao para login.service.js

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
app.post('/login', validarLogin1, validarLogin2, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  const { email, password } = req.body;

  if (email && password) {
    res.status(200).json({ token });
  }
});

// 5 - Crie o endpoint POST /talker
// Os seguintes pontos serão avaliados:
// O endpoint deve ser capaz de adicionar uma nova pessoa palestrante ao seu arquivo;
// O corpo da requisição deverá ter o seguinte formato:
// {
//   "name": "Danielle Santos",
//   "age": 56,
//   "talk": {
//     "watchedAt": "22/10/2019",
//     "rate": 5
//   }
// }
// Caso esteja tudo certo, retorne o status 201 e a pessoa cadastrada.
// O endpoint deve retornar o status 201 e a pessoa palestrante que foi cadastrada, da seguinte forma:
// {
//   "id": 1,
//   "name": "Danielle Santos",
//   "age": 56,
//   "talk": {
//     "watchedAt": "22/10/2019",
//     "rate": 5
//   }
// }

app.post('/talker', validarToken, validarNome, validarIdade, validarTalk,
  validarWatchedAt, validarRate, async (req, res) => {
    const talker = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
    const id = talker.length + 1;
    const { name, age, talk } = req.body;
    const pessoaPalestrante = { name, age, id, talk };
    const talkerModificado = [...talker, pessoaPalestrante];
    // console.log(talkerModificado);
    // console.log(JSON.stringify(talkerModificado));
    // {
    //   name: 'Danielle Santos',
    //   age: 56,
    //   id: 5,
    //   talk: { watchedAt: '22/10/2019', rate: 5 }
    // }
    // {"name":"Danielle Santos","age":56,"id":7,"talk":{"watchedAt":"22/10/2019","rate":5}},{"name":"Danielle Santos","age":56,"id":8,"talk":{"watchedAt":"22/10/2019","rate":5}}]
    // nota estava apanhando em converter data, quando uso .parse não posso escrever direto, lembrar sempre de novamente .string para converter em string
    await fs.writeFile(pathTalker, JSON.stringify(talkerModificado));
    res.status(201).json(pessoaPalestrante);
});

// 6 - Crie o endpoint PUT /talker/:id
// Os seguintes pontos serão avaliados:
// O endpoint deve ser capaz de editar uma pessoa palestrante com base no id da rota, sem alterar o id registrado.
// O corpo da requisição deverá ter o seguinte formato:
// {
//   "name": "Danielle Santos",
//   "age": 56,
//   "talk": {
//     "watchedAt": "22/10/2019",
//     "rate": 5
//   }
// }
// Caso esteja tudo certo, retorne o status 200 e a pessoa editada.
// O endpoint deve retornar o status 200 e a pessoa palestrante que foi editada, da seguinte forma:
// {
//   "id": 1,
//   "name": "Danielle Santos",
//   "age": 56,
//   "talk": {
//     "watchedAt": "22/10/2019",
//     "rate": 4
//   }
// }
app.put('/talker/:id', validarToken, validarNome, validarIdade, validarTalk,
  validarWatchedAt, validarRate, async (req, res) => {
    const { id } = req.params;
    const talker = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
    // ● 6 - Crie o endpoint PUT /talker/:id › Será validado que é possível editar uma pessoa palestrante com sucesso
    // expect(received).toEqual(expected) // deep equality
    // Expected: ArrayContaining [ObjectContaining {"age": 25, "id": 5, "name": "Zendaya", "talk": {"rate": 4, "watchedAt": "24/10/2020"}}]
    // Received: [{"age": 62, "id": 1, "name": "Henrique Albuquerque", "talk": {"rate": 5, "watchedAt": "23/10/2020"}}, {"age": 67, "id": 2, "name": "Heloísa Albuquerque", "talk": {"rate": 5, "watchedAt": "23/10/2020"}}, {"age": 33, "id": 3, "name": "Ricardo Xavier Filho", "talk": {"rate": 5, "watchedAt": "23/10/2020"}}, {"age": 24, "id": 4, "name": "Marcos Costa", "talk": {"rate": 5, "watchedAt": "23/10/2020"}}, {"age": 24, "id": 5, "name": "Zendaya Maree", "talk": {"rate": 5, "watchedAt": "25/09/2020"}}]
    // const talkerUpdate = talker.find((element) => Number(element.id) === Number(id));
    const talkerID = {
      ...req.body,
      id: Number(id),
    };
    const talkerEditado = talker.map((element) => {
      const update = Number(element.id) === Number(id) ? talkerID : element;
      return update;
    });
    await fs.writeFile(pathTalker, JSON.stringify(talkerEditado));
    return res.status(200).json(talkerID);
});

// 7 - Crie o endpoint DELETE /talker/:id
// O endpoint deve deletar uma pessoa palestrante com base no id da rota. Devendo retornar o status 204, sem conteúdo na resposta.
app.delete('/talker/:id', validarDelete, async (req, res) => {
  const { id } = req.params;
  const talker = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  console.log(talker);
  // refaz filtro e pega todos novamente exceto o ID escolhido para delete
  const talkerID = talker.filter((element) => Number(element.id) !== Number(id));
  console.log(talkerID);
  await fs.writeFile(pathTalker, JSON.stringify(talkerID));
  return res.sendStatus(204);
});

// 8 - Crie o endpoint GET /talker/search?q=searchTerm
// Os seguintes pontos serão avaliados:
// O endpoint deve retornar um array de palestrantes que contenham em seu nome o termo pesquisado no queryParam da URL. Devendo retornar o status 200, com o seguinte corpo:
// /search?q=Da
// [
//   {
//     "id": 1,
//     "name": "Danielle Santos",
//     "age": 56,
//     "talk": {
//       "watchedAt": "22/10/2019",
//       "rate": 5,
//     },
//   }
// ]
// Caso searchTerm não seja informado ou esteja vazio, o endpoint deverá retornar um array com todos as pessoas palestrantes cadastradas, assim como no endpoint GET /talker, com um status 200.
// Caso nenhuma pessoa palestrante satisfaça a busca, o endpoint deve retornar o status 200 e um array vazio.
// Dica é importante ter atenção se essa rota não entra em conflito com as outras, já que a ordem das rotas faz diferença na interpretação da aplicação

app.get('/talker/search', validarDelete, async (req, res) => {
  const searchTerm = req.query.q;
  const talker = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  // fazer filtro onde inclua o campo .name alguma informação digitada
  const talkerQ = talker.filter((element) => element.name.includes(searchTerm));
  console.log(talkerQ);
  return res.status(200).json(talkerQ);
});

app.listen(PORT, () => {
  console.log('Online');
});