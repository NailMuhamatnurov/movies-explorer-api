const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const auth = (req, res, next) => {
  const { cookies } = req;
  const authorization = cookies.token;
 
  if (!authorization) {
    return next(new AuthError('Токен остутствует или некорректен'));
  }

  const token = authorization;

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthError('Токен не верифицирован, авторизация не пройдена'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
