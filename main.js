const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 4000;

const DATA_FILE = path.join(__dirname, "expenses.json");
const SECRET_KEY = "random123";

app.use(express.json());

function readExpenses() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeExpenses(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post("/expenses", (req, res) => {
  const expenses = readExpenses();
  const newExpense = { id: Date.now(), ...req.body };
  expenses.push(newExpense);
  writeExpenses(expenses);
  res.json(newExpense);
});

app.get("/expenses", (req, res) => {
  const pageNum = parseInt(req.query.page) || 1;
  const takeNum = parseInt(req.query.take) || 30;
  const expenses = readExpenses();
  const start = (pageNum - 1) * takeNum;
  const paginated = expenses.slice(start, start + takeNum);
  res.json(paginated);
});

app.put("/expenses/:id", (req, res) => {
  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Expense not found" });
  expenses[index] = { ...expenses[index], ...req.body };
  writeExpenses(expenses);
  res.json(expenses[index]);
});

app.delete("/expenses/:id", (req, res) => {
  const secret = req.headers.secret;
  if (secret !== SECRET_KEY) {
    return res.status(403).json({ error: "Invalid or missing secret key" });
  }

  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Expense not found" });

  const deleted = expenses.splice(index, 1);
  writeExpenses(expenses);
  res.json({ message: "Expense deleted", deleted });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
