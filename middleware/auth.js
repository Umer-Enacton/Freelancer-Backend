const jwt = require("jsonwebtoken");
const { getUsers } = require("../utils/oprations");
let JWT_SECRET = "Shhh";
const auth = (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader != "undefined") {
      const token = bearerHeader.split(" ")[1];
      const user = jwt.verify(token, JWT_SECRET);
      req.token = user;
      next();
    } else {
      res.status(401).json({ message: "No Token Provided" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
module.exports = auth;
