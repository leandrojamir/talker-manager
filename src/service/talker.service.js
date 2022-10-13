// pulando ideia de terminar esse projeto em uma página proposital devido limite de 250, mas voltar nele depois para aplicar M e C

// 5 - Crie o endpoint POST /talker
// A requisição deve ter o token de autenticação nos headers, no campo authorization.
// Caso o token não seja encontrado retorne um código de status 401, com o seguinte corpo:
// {
//   "message": "Token não encontrado"
// }
// Caso o token seja inválido retorne um código de status 401, com o seguinte corpo:
// {
//   "message": "Token inválido"
// }
const validarToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json(
      {
        message: 'Token não encontrado',
      },
    );
  }
  if (authorization.length !== 16) {
    return res.status(401).json(
      {
        message: 'Token inválido',
      },
    );
  }
  next();
};

// O campo name deverá ter no mínimo 3 caracteres. Ele é obrigatório.
// Caso o campo não seja passado ou esteja vazio retorne um código de status 400, com o seguinte corpo:
// {
//   "message": "O campo \"name\" é obrigatório"
// }
// Caso o nome não tenha pelo menos 3 caracteres retorne um código de status 400, com o seguinte corpo:
// {
//   "message": "O \"name\" deve ter pelo menos 3 caracteres"
// }
const validarNome = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json(
      {
        message: 'O campo "name" é obrigatório',
      },
    );
  }
  if (name.length < 3) {
    return res.status(400).json(
      {
        message: 'O "name" deve ter pelo menos 3 caracteres',
      },
    );
  }
  next();
};

// O campo age deverá ser um inteiro e apenas pessoas maiores de idade (pelo menos 18 anos) podem ser cadastrados. Ele é obrigatório.
// Caso o campo não seja passado ou esteja vazio retorne um código de status 400, com o seguinte corpo:
// {
//   "message": "O campo \"age\" é obrigatório"
// }
// Caso a pessoa palestrante não tenha pelo menos 18 anos retorne status 400, com o seguinte corpo:
// {
//   "message": "A pessoa palestrante deve ser maior de idade"
// }
const validarIdade = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json(
      {
        message: 'O campo "age" é obrigatório',
      },
    );
  }
  if (age < 18) {
    return res.status(400).json(
      {
        message: 'A pessoa palestrante deve ser maior de idade',
      },
    );
  }
  next();
};

// O campo talk deverá ser um objeto com as chaves watchedAt e rate:
// O campo talk é obrigatório.
// Caso o campo não seja informado retorne status 400, com o seguinte corpo:
// {
//   "message": "O campo \"talk\" é obrigatório"
// }
const validarTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json(
      {
        message: 'O campo "talk" é obrigatório',
      },
    );
  }
  next();
};

// A chave watchedAt é obrigatória.
// Caso a chave não seja informada ou esteja vazia retorne status 400, com o seguinte corpo:
// {
//   "message": "O campo \"watchedAt\" é obrigatório"
// }
// A chave watchedAt deve ser uma data no formato dd/mm/aaaa.
// Caso a data não respeite o formato dd/mm/aaaa retorne status 400, com o seguinte corpo:
// {
//   "message": "O campo \"watchedAt\" deve ter o formato \"dd/mm/aaaa\""
// }
// https://pt.stackoverflow.com/questions/371316/valida%C3%A7%C3%A3o-regex-de-data-com-2-2-4-caracteres
// let match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec('20/10/2018');
const validarWatchedAt = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  const regexDDMMAAAA = /^\d{2}\/?\d{2}\/\d{4}$/;
  if (!watchedAt) {
    return res.status(400).json(
      {
        message: 'O campo "watchedAt" é obrigatório',
      },
    );
  }
  const regexTest = regexDDMMAAAA.test(watchedAt);
  if (!regexTest) {
    return res.status(400).json(
      {
        message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
      },
    );
  }
  next();
};

// O campo rate é obrigatório.
// Caso o campo não seja informado ou esteja vazio retorne status 400, com o seguinte corpo:
// {
//   "message": "O campo \"rate\" é obrigatório"
// }
// A chave rate deve ser um inteiro de 1 à 5.
// Caso a nota não seja um inteiro de 1 à 5 retorne status 400, com o seguinte corpo:
// {
//   "message": "O campo \"rate\" deve ser um inteiro de 1 à 5"
// }

// ● 6 - Crie o endpoint PUT /talker/:id › Será validado que não é possível editar uma pessoa palestrante com rate menor que 1
// expect(received).toBe(expected) // Object.is equality
// Expected: "O campo \"rate\" deve ser um inteiro de 1 à 5"
// Received: "O campo \"rate\" é obrigatório"
//   599 |           .then((responseUpdate) => {
//   600 |             const { json } = responseUpdate;
// > 601 |             expect(json.message).toBe(
//       |                                  ^
//   602 |               'O campo "rate" deve ser um inteiro de 1 à 5',
//   603 |             );
//   604 |           });
//   at 06-editTalker.test.js:601:34
//   at ../node_modules/frisby/src/frisby/spec.js:250:34
// Test Suites: 1 failed, 1 total
// Tests:       1 failed, 12 passed, 13 total
// name: 'Zendaya',
// age: 25,
// talk: {
//   watchedAt: '24/10/2020',
//   rate: 0,
const validarRate = (req, res, next) => {
  const { rate } = req.body.talk;
  if (Number(rate) === 0) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (!rate) {
    return res.status(400).json(
      {
        message: 'O campo "rate" é obrigatório',
      },
    );
  }
  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' }); 
  }
  next();
};

module.exports = {
  validarToken,
  validarNome,
  validarIdade,
  validarTalk,
  validarWatchedAt,
  validarRate,
};