const express = require("express");
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../services/expenseService");

const requireSecret = require("../middlewares/requiresecret");
const validateExpense = require("../middlewares/validateexpenes");

const router = express.Router();

router.get("/", getExpenses);
router.post("/", validateExpense, createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", requireSecret, deleteExpense);

module.exports = router;
