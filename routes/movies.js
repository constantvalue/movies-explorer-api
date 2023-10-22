// eslint-disable-next-line
//eslint-disable-line

const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const UrlPattern = require('../utils/UrlPattern');

const {
  getMovies, addMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

// валидируем URL с помощью регулярного выражения.
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(UrlPattern).required(),
    trailerLink: Joi.string().pattern(UrlPattern).required(),
    thumbnail: Joi.string().pattern(UrlPattern).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), addMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
