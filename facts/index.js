const express = require("express");
const router = express.Router();
const randomBlocker = require("../middlewares/randomblocker");

const facts = [
  "Bananas are berries, but strawberries aren't.",
  "Honey never spoils.",
  "Octopuses have three hearts.",
  "The Eiffel Tower can grow taller in summer.",
  "Some cats are allergic to humans.",
];

router.get("/", randomBlocker, (req, res) => {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  res.json({ fact });
});

module.exports = router;
