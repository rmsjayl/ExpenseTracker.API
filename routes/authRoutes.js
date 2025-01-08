const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authenticate");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  accountVerification,
  updateProfile,
} = require("../controllers/authController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/verifyaccount/:id/token/:verificationToken").get(accountVerification);
router.route("/resetpassword/:id/:resetPasswordToken").put(protect, resetPassword);
router.route("/updateprofile/:id").put(protect, updateProfile);

module.exports = router;
