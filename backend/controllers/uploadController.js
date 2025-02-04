const path = require("path");
const fs = require("fs");
const multer = require("multer");
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

    // Once uploaded, get the uploaded filenames
    const uploadedFiles = req.files.map((file) => file.filename);

    // Process each uploaded file to compute and store face encodings
    const pythonScriptPath = path.join(__dirname, "../scripts/compute_encodings.py");
    const uploadDir = path.join(__dirname, "../uploads");

    // Prepare arguments: pass the list of uploaded files
    const filesArg = uploadedFiles.join(",");

    // Execute the Python script
    exec(
      `python "${pythonScriptPath}" "${uploadDir}" "${filesArg}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error}`);
          return res
            .status(500)
            .json({ error: "Error processing images", details: stderr });
        }

        // Respond to the client
        res.json({
          message: "Images uploaded and processed successfully",
          uploadedFiles,
        });
      }
    );
  });
};

module.exports = { uploadImages };