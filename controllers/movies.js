const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const NoRightsError = require('../errors/noRightsError');
const ValidationError = require('../errors/validationError');
const ItExistError = require('../errors/itExistError');

const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies.map((movie) => movie));
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new NoRightsError('Недостаточно прав для удаления');
      } else {
        return movie.remove()
          .then(() => res.send({ message: `Фильм  '${movie.nameRU}' удален из избранного` }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные id фильма'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
};
