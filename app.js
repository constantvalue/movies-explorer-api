require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { celebrate, errors, Joi } = require('celebrate');
const { addUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { regEx } = require('./constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// эти роуты не требуют защиты авторизацией.

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    avatar: Joi.string().pattern(regEx),
  }),
}), addUser);

// app.post('/signin', login);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// все что идет после этого мидлвара - будет защищено авторизацией
app.use(auth);

// роуты для юзерконтроллера
app.use('/users', require('./routes/users'));

// роуты для кардконтроллера
app.use('/movies', require('./routes/movies'));

// последний эндпоинт тест. Обработка несуществующего пути.
app.use('/*', (req, res, next) => next(new NotFoundError('Страница не существует')));

app.use(errorLogger);

// обрабатываем ошибки которые генерирует celebrate.
// Этот метод вернет тело ошибки с указанием причины ошибки валидации.
app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
