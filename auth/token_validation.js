const jwt = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.split(" ")[1];
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
          return res.json({
            message: "Invalid Token..."
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).json({
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};