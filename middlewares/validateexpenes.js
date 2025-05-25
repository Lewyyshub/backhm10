module.exports = (req, res, next) => {
  const { name, amount } = req.body;
  if (!name || amount == null) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name or amount" });
  }
  next();
};
