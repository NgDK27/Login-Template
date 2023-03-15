const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const exist = await User.findOne({ email });
  if (exist) {
    res.status(400);
    throw new Error("Invalid email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPass,
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, highestScore } = user;
    res.status(201).json({
      _id,
      name,
      email,
      highestScore,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user && passwordCorrect) {
    const { _id, name, email, highestScore } = user;
    res.status(200).json({
      _id,
      name,
      email,
      highestScore,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid");
  }
});

module.exports = {
  registerUser,
  loginUser,
};
