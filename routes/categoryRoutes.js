const express = require("express");
const router = express.Router();

const { protect, adminAuthentication } = require("../middleware/authenticate");
const {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

router
  .route("/category")
  .get(protect, adminAuthentication, getAllCategories)
  .post(protect, adminAuthentication, createCategory);

router
  .route("/category/:id")
  .get(protect, adminAuthentication, getAllCategories)
  .put(protect, adminAuthentication, updateCategory)
  .delete(protect, adminAuthentication, deleteCategory);

module.exports = router;
