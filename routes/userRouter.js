const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.route("/").get(userController.getAllUsers);
router
  .route("/:id/status")
  .patch( userController.updateUserStatus);

router.route("/:id").delete(userController.deleteUser);

module.exports = router;
