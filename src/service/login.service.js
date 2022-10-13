// 4 - Adicione as validações para o endpoint /login
// Caso o campo email não seja passado ou esteja vazio, retorne um código de status 400 com o seguinte corpo:
// {
//   "message": "O campo \"email\" é obrigatório"
// }
// Caso o email passado não seja válido, retorne um código de status 400 com o seguinte corpo:
// {
//   "message": "O \"email\" deve ter o formato \"email@email.com\""
// }
// Caso o campo password não seja passado ou esteja vazio retorne um código de status 400 com o seguinte corpo:
// {
//   "message": "O campo \"password\" é obrigatório"
// }
// Caso a senha não tenha pelo menos 6 caracteres retorne um código de status 400 com o seguinte corpo:
// {
//   "message": "O \"password\" deve ter pelo menos 6 caracteres"
// }
const validarLogin1 = (req, res, next) => {
  const { email } = req.body;
  const regexSimples = /\S+@\S+\.\S+/;
  if (!email) {
    return res.status(400).json(
      {
        message: 'O campo "email" é obrigatório',
      },
    );
  }
  if (!regexSimples.test(email)) {
    return res.status(400).json(
      {
        message: 'O "email" deve ter o formato "email@email.com"',
      },
    );
  }
  next();
};
// quebrando em 2 // eslint-disable-next-line max-lines-per-function
const validarLogin2 = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json(
      {
        message: 'O campo "password" é obrigatório',
      },
    );
  }
  if (password.length <= 6) {
    return res.status(400).json(
      {
        message: 'O "password" deve ter pelo menos 6 caracteres',
      },
    );
  } 
  next();
};

module.exports = {
  validarLogin1,
  validarLogin2,
};