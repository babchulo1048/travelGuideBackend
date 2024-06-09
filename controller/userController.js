const User = require("../models/User");
const asyncMiddleware = require("../middleware/async");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { useParams } = require("react-router-dom");
const TourGuide = require("../models/TourGuide");

exports.detail = asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  res.status(201).json(user);
});

exports.register = asyncMiddleware(async (req, res) => {
  const { username, name, password, email, contactInformation } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  let user = new User({
    username,
    name,
    password: hashedPassword,
    email,
    contactInformation,
  });

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIREDIN,
  });
  res.status(201).json({ user, token });
});

exports.login = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
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
  res.status(200).json({ user, token });
});

exports.update = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const { username, name, email, contactInformation } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    {
      username,
      name,
      email,
      contactInformation,
    },
    { new: true }
  );
  res.status(200).json({ user });
});

exports.userActive = asyncMiddleware(async (req, res) => {
  const users = await User.find({ status: "active" });
  // console.log("users:", users);

  res.status(201).json(users);
});

exports.userBanned = asyncMiddleware(async (req, res) => {
  const users = await User.find({ status: "ban" });

  res.status(201).json(users);
});

exports.rateTourGuide = asyncMiddleware(async (req, res) => {
  const { userId, guideId } = req.params;
  const { rating } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.send("user not found");

  let guide = await TourGuide.findById(guideId);
  if (!guide) return res.status(404).send("Guide not found");

  // Check if user has already rated the guide
  const existingRatingIndex = guide.ratings.findIndex(
    (r) => r.userId.toString() === userId
  );
  if (existingRatingIndex !== -1) {
    // Update existing rating
    guide.ratings[existingRatingIndex].rating = rating;
  } else {
    // Add new rating
    guide.ratings.push({ userId, rating });
  }

  // Calculate the average rating
  const totalRating = guide.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  guide.averageRating = totalRating / guide.ratings.length;

  await guide.save();

  res.send(guide);

  // guide = await TourGuide.findByIdAndUpdate(
  //   guideId,
  //   { rating: rating },
  //   { new: true }
  // );

  // res.send(guide);
});
