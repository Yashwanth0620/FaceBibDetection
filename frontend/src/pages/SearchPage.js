import React, { useState } from "react";
import axios from "axios";

function SearchPage() {
  const [bibNumber, setBibNumber] = useState("");
  const [selectedFace, setSelectedFace] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBibNumberChange = (e) => {
    setBibNumber(e.target.value);
  };

  const handleFaceChange = (e) => {
    setSelectedFace(e.target.files[0]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setStatusMessage(""); // Reset status message
    setLoading(true);

    try {
      let response;

      if (bibNumber) {
        // If Bib Number is entered, send search request by bib number
        response = await axios.post("http://localhost:5000/api/search/bib", { bibNumber });
      } else if (selectedFace) {
        // If Face Image is selected, send search request by face
        const formData = new FormData();
        formData.append("face", selectedFace);
        response = await axios.post("http://localhost:5000/api/search/face", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Set success message
      console.log(response.data.images);
      setStatusMessage(`Found ${response.data.images.length} images.`);
    } catch (error) {
      // Handle error and set error message
      setStatusMessage("Error: No images found or an issue occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Search for Your Photos</h2>
      <form onSubmit={handleSearch}>
        {/* Search by Bib Number */}
        <div className="mb-3">
          <label htmlFor="bibNumber" className="form-label">
            Enter Bib Number
          </label>
          <input
            type="text"
            className="form-control"
            id="bibNumber"
            value={bibNumber}
            onChange={handleBibNumberChange}
          />
        </div>

        {/* Search by Face Image */}
        <div className="mb-3">
          <label htmlFor="face" className="form-label">
            Upload Face Image
          </label>
          <input
            type="file"
            className="form-control"
            id="face"
            onChange={handleFaceChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Status Message */}
      {statusMessage && (
        <div className="mt-3 alert alert-info" role="alert">
          {statusMessage}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
