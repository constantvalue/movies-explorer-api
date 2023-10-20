// const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();

const {
  getMovies, addMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

// Создаю фильм с новыми данными
router.post('/', addMovie);

// Удаляю сохранённый фильм по id
// router.delete('/movies/:movieId', deleteMovie);

module.exports = router;
