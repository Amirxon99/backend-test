const express = require("express");
const authController = require("../controllers/authController");
const { body } = require("express-validator");
const router = express.Router();

router.post(
  "/login",
  body("email", "Login bo'sh bo'lishi mumkin emas")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Login kamida 5 ta belgidan iborat bo'lishi kerak"),
  body("password", "Parol bo'sh bo'lishi mumkin emas")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  authController.login
);
router.post(
  "/register",
  body("name").notEmpty().withMessage("Ism bo'sh bo'lishi mumkin emas"),
  body("email", "email bo'sh bo'lishi mumkin emas")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Login kamida 5 ta belgidan iborat bo'lishi kerak"),
  body("password", "Parol bo'sh bo'lishi mumkin emas")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Parol kamida 6 ta belgidan iborat bo'lishi kerak"),

  authController.register
);

module.exports = router;
