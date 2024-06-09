const express = require("express");
const packageController = require("../controller/packageController");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

const router = express.Router();
router.use(express.json());

// Serve uploaded images
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.post("/create", upload.single("image"), packageController.create);

router.get("/detail", packageController.detail);

router.get("/topRated", packageController.TopRatedPackages);

router.get("/detail/:id", packageController.getPackageById);

router.put("/:id", upload.single("image"), packageController.updatePackage);

router.delete("/:id", packageController.deletePackage);

module.exports = router;
