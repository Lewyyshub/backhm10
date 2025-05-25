const express = require("express");
const expensesRouter = require("./routes/expenses");
const randomFactRouter = require("./facts");

const app = express();
const PORT = 4000;

app.use(express.json());

app.use("/expenses", expensesRouter);
app.use("/random-fact", randomFactRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
