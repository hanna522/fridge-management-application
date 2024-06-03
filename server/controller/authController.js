const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    console.log("User registered: ", email );
    res.json({ message: "User registered", email });
  } catch (err) {
    console.log("err.message");
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid email" });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    console.log("Successfully logged in! ", user.email);
    res.json({ token });
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }
    res.json({ email: user.email, userName: user.email.split('@')[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
