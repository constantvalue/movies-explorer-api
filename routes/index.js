const router = require('express').Router();
const auth = require('../middlewares/auth');

const movieRoutes = require('./movies');
const userRoutes = require('./users');
const signupRoutes = require('./signup');
const signinRoutes = require('./signin');


router.use('/signup', signupRoutes);
router.use('/signin', signinRoutes);

//защищаем авторизацией роуты ниже
router.use(auth);

router.use('/movies', movieRoutes);
router.use('users', userRoutes);





module.exports = router;
