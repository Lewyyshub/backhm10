const SECRET_KEY = "random123";

module.exports = (req, res, next) => {
  const secret = req.headers.secret;
  if (secret !== SECRET_KEY) {
    return res.status(403).json({ error: "Invalid or missing secret key" });
  }
  next();
};
