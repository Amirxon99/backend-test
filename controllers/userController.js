const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
// const { Op } = require("sequelize");

exports.getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await User.findAndCountAll({
    attributes: ["id", "name", "email", "lastLoginTime", "status"],
  });
  res.json({
    status: "success",
    message: "",
    error: null,
    data: {
      allUsers: allUsers.rows,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userById = await User.findByPk(id);
  if (!userById) {
    return next(new AppError("Bunday Id li user topilmadi", 404));
  }
  await userById.destroy();
  res.status(201).json({
    status: "success",
    message: "Deleted User",
    error: null,
    data: null,
  });
});

exports.updateUserStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const status = req.body;
  if (status !== "ACTIVE" || status !== "BLOCKED") {
    return next(
      new AppError(
        `Status hato kiritildi!! Statusni ACTIVE yoki BLOCKED kiritish mumkin`
      ),
      404
    );
  }
  const userById = await User.findByPk(id);
  if (!userById) {
    return next(new AppError(`${id} bunday idli User mavjud emas!!`), 404);
  }

  const updatedUser = await userById.update(status);
  res.json({
    status: "success",
    message: "User status successfuly edited!!",
    error: null,
    data: {
      updatedUser,
    },
  });
});
