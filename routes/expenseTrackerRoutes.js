const express = require("express");
const router = express.Router();
const { protect, adminAuthentication } = require("../middleware/authenticate");
const {
  getAllExpense,
  getExpenseById,
  createExpense,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseTrackerController");
const { ownership } = require("../middleware/ownership");
const Expense = require("../models/expense");

router
  .route("/expense")
  .get(protect, adminAuthentication, getAllExpense)
  .post(protect, adminAuthentication, createExpense);
router
  .route("/expense/:id")
  .get(protect, adminAuthentication, getExpenseById)
  .put(protect, adminAuthentication, ownership(Expense), updateExpense)
  .delete(protect, adminAuthentication, deleteExpense);

module.exports = router;
