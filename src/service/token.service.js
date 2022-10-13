// 7 - Crie o endpoint DELETE /talker/:id
// Os seguintes pontos serão avaliados:
// A requisição deve ter o token de autenticação nos headers, no campo authorization.
// Caso o token não seja encontrado retorne um código de status 401, com o seguinte corpo:
// {
//   "message": "Token não encontrado"
// }
// Caso o token seja inválido retorne um código de status 401, com o seguinte corpo:
// {
//   "message": "Token inválido"
// }
// O endpoint deve deletar uma pessoa palestrante com base no id da rota. Devendo retornar o status 204, sem conteúdo na resposta.
const validarDelete = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send(
      {
        message: 'Token não encontrado',
      },
    );
  }
  if (authorization.length < 16) {
    return res.status(401).send(
      {
        message: 'Token inválido',
      },
    );
 }
  next();
};

module.exports = { validarDelete };