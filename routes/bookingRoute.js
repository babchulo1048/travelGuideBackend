const express = require("express");
const bookingController = require("../controller/bookingController");
const router = express.Router();
router.use(express.json());

router.post("/create/:userId", bookingController.createBooking);

router.get("/detail", bookingController.getBookings);

router.get("/guide/:id", bookingController.getBookingByGuide);

router.get("/user/:userId", bookingController.getBookingsByUser);
router.get("/package/:packageId", bookingController.getBookingsByPackage);

router.put("/update/:bookingId", bookingController.updateBookingStatus);

router.delete("/delete/:bookingId", bookingController.deleteBooking);

module.exports = router;
