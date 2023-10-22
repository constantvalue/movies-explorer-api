const router = require('express').Router();
const auth = require('../middlewares/auth');

const movieRoutes = require('./movies');
const userRoutes = require('./users');
const signupRoutes = require('./signup');
const signinRoutes = require('./signin');

const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', signupRoutes);
router.use('/signin', signinRoutes);

// защищаем авторизацией роуты ниже
router.use(auth);

router.use('/movies', movieRoutes);
router.use('/users', userRoutes);

// Обработка несуществующего пути.
router.use('/*', (req, res, next) => next(new NotFoundError('Страница не существует')));

module.exports = router;
