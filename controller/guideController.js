const asyncMiddleware = require("../middleware/async");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const TourGuide = require("../models/TourGuide");
const Booking = require("../models/Booking");

exports.register = asyncMiddleware(async (req, res) => {
  const { name, email, password, location, website, phone, description } =
    req.body;

  const guide = await TourGuide.findOne({ email: email });

  if (guide)
    return res.status(400).send("TourGuide with this email already exist.");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  let user = new TourGuide({
    name,
    email,
    password: hashedPassword,
    location,
    website,
    phone,
    description,
  });
  // if (role === "admin") {
  //   user = new Admin({ name, email, password: hashedPassword, role });
  // } else {
  //   user = new TourGuide({ name, email, password: hashedPassword, role });
  // }

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIREDIN,
  });

  res.status(201).json({ user, token });
});

// Route to login
exports.login = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  let user = await TourGuide.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Check if user is banned
  if (user.status === "ban") {
    return res.status(403).json({
      error:
        "Your account has been banned. Please contact support for further assistance.",
    });
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
  res.status(200).json({ token, name: user.name, id: user._id });
});

exports.guideActive = asyncMiddleware(async (req, res) => {
  const guides = await TourGuide.find({ status: "active" });

  // const totalRating = guides.ratings.reduce(
  //   (acc, curr) => acc + curr.rating,
  //   0
  // );
  // guides.averageRating = totalRating / guides.ratings.length;

  res.status(201).json(guides);
});

exports.guideBanned = asyncMiddleware(async (req, res) => {
  const users = await TourGuide.find({ status: "ban" });

  res.status(201).json(users);
});

exports.managBooking = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!updatedBooking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.status(200).json(updatedBooking);
});
