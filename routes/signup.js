const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const { addUser } = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),

  }),
}), addUser);

module.exports = router;
