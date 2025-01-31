import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("photos uploading...");
    
    if (selectedFiles) {
      const formData = new FormData();
      // Append each file to the FormData object
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("photos", selectedFiles[i]);
      }

      try {
        // Send the POST request to the API endpoint
        const response = await axios.post("http://localhost:5000/api/upload/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Print success message on successful upload
        setStatusMessage(`Success! ${response.data.message}`);
      } catch (error) {
        // Handle error
        setStatusMessage("Error uploading photos. Please try again.");
        console.error("Upload Error:", error);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Upload Event Photos</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="photos" className="form-label">
            Select Photos
          </label>
          <input
            type="file"
            className="form-control"
            id="photos"
            onChange={handleFileChange}
            multiple
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Upload Photos
        </button>
      </form>

      {statusMessage && (
        <div className="mt-3 alert alert-info">
          {statusMessage}
        </div>
      )}
    </div>
  );
}

export default Upload;
