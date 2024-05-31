const jwt = require("jsonwebtoken");
const User = require("../model/user");

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("Not registered user");
      throw new Error();
    }
    req.user = user;
    console.log("Found user: ", user.email);
    next();
  } catch (err) {
    console.log("Please authenticate.");
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;