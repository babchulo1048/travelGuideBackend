const express = require("express");
const guideController = require("../controller/guideController");
const router = express.Router();
router.use(express.json());

router.post("/login", guideController.login);

router.post("/register", guideController.register);

router.get("/active", guideController.guideActive);

router.get("/banned", guideController.guideBanned);

router.put("/manageBook/:id", guideController.managBooking);

module.exports = router;
