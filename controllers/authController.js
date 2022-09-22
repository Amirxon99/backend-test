const catchAsync = require("../utils/catchAsync");
const { Op } = require("sequelize");
const jsonWebToken = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");
const User = require("../models/User");
const { compare } = require("bcrypt");

const generateToken = (payload, jwtSecret, options) => {
  return new Promise((resolve, rejected) => {
    jsonWebToken.sign(payload, jwtSecret, options, (err, token) => {
      if (err) {
        rejected(err);
      } else {
        resolve(token);
      }
    });
  });
};

const findByUsername = async (email) => {
  const user = await User.findOne({
    where: { email: { [Op.eq]: email } },
  });
  if (user) {
    return user;
  }
  return null;
};

exports.register = catchAsync(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const err = new AppError("Validation Error", 400);
    err.name = "validationError";
    err.errors = validationErrors.errors;
    err.isOperational = false;
    return next(err);
  }

  const existedUser = await findByUsername(req.body.email);

  if (existedUser) {
    return next(new AppError("Bunday emailli  foydalanuvchi mavjud", 409));
  }
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    message: `Registration success`,
    error: null,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const err = new AppError("Validation Error", 400);
    err.name = "validationError";
    err.errors = validationErrors.errors;
    err.isOperational = false;
    return next(err);
  }

  const { email, password } = req.body;
  const candidate = await findByUsername(email);

  if (!candidate) {
    return next(new AppError("Login yoki Paroll hato kiritikdi!!", 400));
  }

  if (candidate.status === "BLOCKED") {
    return next(new AppError("Siz blocklangansiz", 400));
  }

  if (!candidate) {
    return next(new AppError("Login yoki Paroll hato kiritikdi!!", 400));
  }

  const passwordIsMatch = await compare(password, candidate.password);

  if (!passwordIsMatch) {
    return next(new AppError("Login yoki Paroll hato kiritikdi!!", 400));
  }

  const payload = {
    id: candidate.id,
    firstName: candidate.name,
    email: candidate.email,
    status: candidate.status,
  };
  const token = await generateToken(payload, process.env.JWT_SECRET, {
    algorithm: "HS512",
    expiresIn: "24h",
  });
  candidate.update({ lastLoginTime: Date.now() });
  res.json({
    status: "success",
    data: {
      user: {
        ...payload,
        lastLoginTime: candidate.lastLoginTime,
      },
      jwt: token,
    },
  });
});
