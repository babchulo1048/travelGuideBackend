const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number },
});

const tourGuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  role: { type: String, default: "TourGuide" },
  // Other operator specific properties
  status: {
    type: String,
    default: "active",
  },
  ratings: [RatingSchema],
  averageRating: { type: Number, default: 0 },
});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);

module.exports = TourGuide;
