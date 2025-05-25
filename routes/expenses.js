const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const expenseService = require("../services/expenseService");

router.get("/", expenseService.getExpenses);
router.post("/", upload.single("image"), expenseService.createExpense);
router.put("/:id", upload.single("image"), expenseService.updateExpense);
router.delete("/:id", expenseService.deleteExpense);

module.exports = router;
