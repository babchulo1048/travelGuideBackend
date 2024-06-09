const express = require("express");
const adminController = require("../controller/adminController");
const router = express.Router();
router.use(express.json());

router.post("/login", adminController.login);

router.post("/register", adminController.register);

router.put("/updateGuideStatus/:id", adminController.updateTourGuideStatus);

router.put("/updateUserStatus/:id", adminController.updateUserStatus);

module.exports = router;
