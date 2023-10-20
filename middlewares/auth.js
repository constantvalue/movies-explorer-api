// эту мидлвару взял из теории по спринту.

const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnathorisedError = require('../errors/UnathorisedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnathorisedError(('Авторизуйтесь'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'top_secret');
  } catch (err) {
    next(new UnathorisedError(('Авторизуйтесь')));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

// console.log(process.env.NODE_ENV);
// // console.log(process.env.env_token);
