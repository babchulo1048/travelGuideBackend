const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();
router.use(express.json());

router.get("/active", userController.userActive);
router.get("/banned", userController.userBanned);

router.get("/:id", userController.detail);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/:id", userController.update);
router.put("/rate/:userId/:guideId", userController.rateTourGuide);

module.exports = router;
