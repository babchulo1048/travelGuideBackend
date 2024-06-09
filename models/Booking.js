const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    peopleNumber: {
      type: Number,
      required: true,
    },
    tourGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide",
      required: true,
    },

    status: {
      type: String,
      // enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    method: {
      type: Number,
      default: 0,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
