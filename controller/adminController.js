const Admin = require("../models/Admin");
const asyncMiddleware = require("../middleware/async");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const TourGuide = require("../models/TourGuide");
const User = require("../models/User");

exports.register = asyncMiddleware(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the role is valid
  // if (!["admin", "tourguide"].includes(role)) {
  //   return res.status(400).json({ error: "Invalid role" });
  // }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  let user = new Admin({ name, email, password: hashedPassword });
  // if (role === "admin") {
  //   user = new Admin({ name, email, password: hashedPassword, role });
  // } else {
  //   user = new TourGuide({ name, email, password: hashedPassword, role });
  // }

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIREDIN,
  });

  res.status(201).json({ token, name: user.name, id: user._id });
});

// Route to login
exports.login = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  let user = await Admin.findOne({ email });
  if (!user) {
    user = await TourGuide.findOne({ email });
  }

  if (!user) {
    return res.status(404).json({ error: "Invalid email or password" });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIREDIN,
  });

  // Send user details and token
  res
    .status(200)
    .json({ token, name: user.name, role: user.role, id: user._id });
});

exports.updateTourGuideStatus = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const tourGuide = await TourGuide.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!tourGuide)
    return res.status(404).json({ error: "Tour guide not found" });

  res.status(201).json(tourGuide);
});

exports.updateUserStatus = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = await User.findByIdAndUpdate(id, { status }, { new: true });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.status(201).json(user);
});
