const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Op } = require("sequelize");

const findUser = async (email) => {
  const userByEmail = await User.findOne({
    where: { email: { [Op.eq]: email } },
  });
  return userByEmail;
};

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError("Unauthorized", 401));
  }
  const token = authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);
  const existedUser = await findUser(user.email);
  if (!user || !existedUser) {
    return next(new AppError("Unauthorized", 401));
  }

  if (existedUser.status !== "ACTIVE") {
    return next(new AppError("You are blocked user", 401));
  }
  req.user = user;
  next();
};
