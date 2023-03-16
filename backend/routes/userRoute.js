const express = require("express");
const cookieParser = require("cookie-parser");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
} = require("../controllers/userController");
const protect = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);

module.exports = router;
