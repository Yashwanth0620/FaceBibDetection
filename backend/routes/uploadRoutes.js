const express = require("express");
const router = express.Router();
const { uploadImages } = require("../controllers/uploadController");

// Route to upload images
router.post("/images", uploadImages);

module.exports = router;
