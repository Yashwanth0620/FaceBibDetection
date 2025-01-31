const path = require("path");
const fs = require("fs");
const multer = require("multer");
// Controller function to upload images
const { exec } = require("child_process");

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    // Ensure the uploads folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // Specify the folder where images will be stored
  },
  filename: (req, file, cb) => {
    // Use the original filename for simplicity (you can customize here)
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid name conflicts
  },
});

const upload = multer({ storage: storage });

// Controller function to upload images
const uploadImages = (req, res) => {
  // Use multer to handle file upload
  upload.array("photos")(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error uploading images", details: err });
    }

    // Once uploaded, send back the uploaded filenames
    const uploadedFiles = req.files.map((file) => file.filename);

    // Respond to the client
    res.json({
      message: "Images uploaded and processed successfully",
      uploadedFiles,
    });
  });
};

module.exports = { uploadImages };
