const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const tokenRaw = token.split(" ")[1];
    const decoded = jwt.verify(tokenRaw, "secretkey");
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
