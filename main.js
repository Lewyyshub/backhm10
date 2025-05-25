const express = require("express");
const path = require("path");
const expensesRouter = require("./routes/expenses");
const randomFactRouter = require("./facts");

const app = express();
const PORT = 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/expenses", expensesRouter);
app.use("/random-fact", randomFactRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
