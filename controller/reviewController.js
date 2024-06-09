const asyncMiddleware = require("../middleware/async");
const Review = require("../models/Review");
const User = require("../models/User");

exports.reviewCreate = asyncMiddleware(async (req, res) => {
  const { userId, text } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const newReview = new Review({
    user: userId,
    text,
  });
  await newReview.save();

  res.status(200).json(newReview);
});

exports.reviewDetail = asyncMiddleware(async (req, res) => {
  const { id } = req.params;
  const review = await Review.find().populate({
    path: "user",
    select: "name", // Specify the field(s) you want to populate
  });
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  res.status(200).json(review);
});
