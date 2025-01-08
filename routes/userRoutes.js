const express = require("express");
const router = express.Router();

const { protect, adminAuthentication } = require("../middleware/authenticate");
const { getAllUsers, getUserById, deleteUser } = require("../controllers/userController");

router.route("/users").get(adminAuthentication, getAllUsers);
router.route("/user/:id").get(protect, getUserById).delete(adminAuthentication, deleteUser);

module.exports = router;
