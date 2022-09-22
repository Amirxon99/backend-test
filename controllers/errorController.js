const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err.errors,
  });
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "dev") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "prod") {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      let error = Object.create(err);
      if (error.name === "SequelizeDatabaseError") {
        if (error.original.code === "22P02") {
          error = new AppError(`Cast error`, 400);
        }
      }

      if (error.name === "SequelizeValidationError") {
        error = new AppError(error.message, 400);
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        if (error.original.code === "23505") {
          error = new AppError("This row already exists", 400);
        }
      }

      if (error.name === "validationError") {
        error.errors = error.errors.map((e) => e.msg);
      }

      sendErrorProd(error, res);
    }
  }
};

module.exports = errorController;
