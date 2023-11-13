const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const { CREATED } = require("../utils/error_codes");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.addUser = (req, res, next) => {
  const { name, password, email } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        password: hash,
        email,
      })
    )
    .then((user) =>
      res.status(CREATED).send({
        email: user.email,
        name: user.name,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректный запрос"));
        return;
      }
      if (err.code === 11000) {
        next(
          new ConflictError("Пользователь с таким email уже зарегестрирован")
        );
        return;
      }

      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Некорректный запрос"));
        return;
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      name: req.body.name,
    },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Некорректный запрос"));
        return;
      }
      if (err.code === 11000) {
        next(
          new ConflictError("Пользователь с таким email уже зарегестрирован")
        );
        return;
      }

      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен (срок действия по брифу - 7 дней)
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "top_secret",
        { expiresIn: "7d" }
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // res
      //   .status(401)
      //   .send({ message: err.message });
      next(err);
    });
};
