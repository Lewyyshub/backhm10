const fs = require("fs");
const path = require("path");
const DATA_FILE = path.join(__dirname, "../expenses.json");

function readExpenses() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeExpenses(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

exports.createExpense = (req, res) => {
  const expenses = readExpenses();
  const newExpense = { id: Date.now(), ...req.body };
  expenses.push(newExpense);
  writeExpenses(expenses);
  res.json(newExpense);
};

exports.getExpenses = (req, res) => {
  const pageNum = parseInt(req.query.page) || 1;
  const takeNum = parseInt(req.query.take) || 30;
  const expenses = readExpenses();
  const start = (pageNum - 1) * takeNum;
  const paginated = expenses.slice(start, start + takeNum);
  res.json(paginated);
};

exports.updateExpense = (req, res) => {
  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Expense not found" });
  expenses[index] = { ...expenses[index], ...req.body };
  writeExpenses(expenses);
  res.json(expenses[index]);
};

exports.deleteExpense = (req, res) => {
  const expenses = readExpenses();
  const index = expenses.findIndex((e) => e.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Expense not found" });
  const deleted = expenses.splice(index, 1);
  writeExpenses(expenses);
  res.json({ message: "Expense deleted", deleted });
};
