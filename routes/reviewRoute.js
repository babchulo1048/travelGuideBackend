const express = require("express");
const reviewController = require("../controller/reviewController");

const router = express.Router();
router.use(express.json());

router.post("/create", reviewController.reviewCreate);
router.get("/detail", reviewController.reviewDetail);

module.exports = router;
