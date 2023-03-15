const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

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

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const { _id, name, email, highestScore } = user;
    res.status(201).json({
      _id,
      name,
      email,
      highestScore,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user");
  }
});

module.exports = registerUser;
