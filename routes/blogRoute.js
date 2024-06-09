const express = require("express");
const blogController = require("../controller/blogController");

const router = express.Router();
router.use(express.json());

router.post("/create", blogController.blogCreate);
router.get("/detail/:id", blogController.blogDetail);

module.exports = router;
