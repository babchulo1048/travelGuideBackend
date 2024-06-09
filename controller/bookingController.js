const asyncMiddleware = require("../middleware/async");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Package = require("../models/Package");
const TourGuide = require("../models/TourGuide");

// Create a new booking
exports.createBooking = asyncMiddleware(async (req, res) => {
  const { userId } = req.params;
  const { package, tourGuide, date, peopleNumber, method } = req.body;

  const users = await User.findById(userId);
  if (!users) {
    return res.status(404).json({ error: "User not found" });
  }

  const packages = await Package.findById(package);
  if (!packages) {
    return res.status(404).json({ error: "Package not found" });
  }

  const tourGuides = await TourGuide.findById(tourGuide);
  if (!tourGuides) {
    return res.status(404).json({ error: "TourGuide not found" });
  }

  const newBooking = new Booking({
    user: userId,
    package,
    tourGuide,
    date,
    peopleNumber,
    method,
  });

  await newBooking.save();

  // Update the isBooked attribute for the tour guide and package
  users.isBooked = true;
  await users.save();

  res.status(201).json(newBooking);
});

// Get all bookings
exports.getBookings = asyncMiddleware(async (req, res) => {
  const bookings = await Booking.find().populate("user").populate("package");
  res.status(200).json(bookings);
});

// Get all bookings by TourGuide
exports.getBookingByGuide = asyncMiddleware(async (req, res) => {
  const { id } = req.params;

  const guide = await TourGuide.findById(id);

  if (!guide) return res.status(404).send("TourGuide NOt Found");

  const bookings = await Booking.find({ tourGuide: id })
    .populate("user")
    .populate("package");
  res.status(200).json(bookings);
});

// Get bookings by user
exports.getBookingsByUser = asyncMiddleware(async (req, res) => {
  const { userId } = req.params;
  const bookings = await Booking.find({ user: userId }).populate("package");
  res.status(200).json(bookings);
});

// Get bookings by package
exports.getBookingsByPackage = asyncMiddleware(async (req, res) => {
  const { packageId } = req.params;
  const bookings = await Booking.find({ package: packageId }).populate("user");
  res.status(200).json(bookings);
});

// Update booking status
exports.updateBookingStatus = asyncMiddleware(async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true }
  );
  if (!updatedBooking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.status(200).json(updatedBooking);
});

// Delete booking
exports.deleteBooking = asyncMiddleware(async (req, res) => {
  const { bookingId } = req.params;
  const deletedBooking = await Booking.findByIdAndDelete(bookingId);
  if (!deletedBooking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.status(204).end();
});
