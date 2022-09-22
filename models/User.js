const { DataTypes, UUID, UUIDV4 } = require("sequelize");
const { hash } = require("bcrypt");
const Sequelize = require("../config/db");
const status = require("../utils/constants/userStatus");

const User = Sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name required",
        },
        len: {
          args: [5],
          msg: "At least 5 character",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6],
          msg: "At least 6 character",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    lastLoginTime: {
      type: DataTypes.DATE,
      defaultValue: null,
    },

    status: {
      type: DataTypes.ENUM(Object.values(status)),
      allowNull: false,
      defaultValue: status.STATUS_ACTIVE,
    },
  },
  {
    underscored: true,
    hooks: {
      async beforeCreate(user) {
        user.password = await hash(user.password, 8);
      },
    },
  }
);

module.exports = User;
