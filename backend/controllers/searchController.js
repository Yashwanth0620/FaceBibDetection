const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Folder where images are uploaded
const uploadFolder = path.join(__dirname, "../uploads");

// Search by Bib Number
const searchByBib = async (req, res) => {
  try {
    const { bibNumber } = req.body;

    // Call Python script for bib search
    const { exec } = require("child_process");
    const pythonScript = path.join(__dirname, "../scripts/search_by_bib.py");

    exec(`python3 ${pythonScript} "${bibNumber}" "${uploadFolder}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        return res.status(500).json({ error: "Error during bib search." });
      }

      const imageLinks = JSON.parse(stdout);
      res.json({ images: imageLinks });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during bib search." });
  }
};

// Search by Face
const searchByFace = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Face image is required." });
    }

    const faceFilePath = req.file.path;

    // Call Python script for face search
    const { exec } = require("child_process");
    const pythonScript = path.join(__dirname, "../scripts/search_by_face.py");

    exec(`python3 ${pythonScript} "${faceFilePath}" "${uploadFolder}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        return res.status(500).json({ error: "Error during face search." });
      }

      const imageLinks = JSON.parse(stdout);
      res.json({ images: imageLinks });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during face search." });
  }
};

module.exports = { searchByBib, searchByFace };
