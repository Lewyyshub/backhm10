const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const expenseService = require("../services/expenseService");

router.get("/", expenseService.getExpenses);
router.post("/", upload.single("image"), expenseService.createExpense);
router.put("/:id", upload.single("image"), expenseService.updateExpense);
router.delete("/:id", expenseService.deleteExpense);

router.get("/view", (req, res) => {
  const expenses = expenseService.readExpenses();
  res.render("expenses/index", { expenses });
});

router.get("/new", (req, res) => {
  res.render("expenses/new");
});

router.get("/:id/view", (req, res) => {
  const expenses = expenseService.readExpenses();
  const expense = expenses.find((e) => e.id == req.params.id);
  if (!expense) return res.status(404).send("Not Found");
  res.render("expenses/show", { expense });
});

router.get("/:id/edit", (req, res) => {
  const expenses = expenseService.readExpenses();
  const expense = expenses.find((e) => e.id == req.params.id);
  if (!expense) return res.status(404).send("Not Found");
  res.render("expenses/edit", { expense });
});

module.exports = router;
