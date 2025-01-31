const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const {
  searchByBib,
  searchByFace,
} = require("../controllers/searchController");

const upload = multer({
  dest: path.join(__dirname, "../temp"),
});

// Route to search by Bib number
router.post("/bib", searchByBib);

// Route to search by face
router.post("/face", upload.single("face"), searchByFace);

module.exports = router;
