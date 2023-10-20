
const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const {
  updateProfile, getUserById,
} = require('../controllers/users');

// router.get('/', getUsers);
router.get('/me', getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

module.exports = router;
