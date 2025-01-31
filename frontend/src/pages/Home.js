import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="text-center">
      <h1 className="display-4 mb-4">Welcome to Event Photo Finder</h1>
      <p className="lead mb-4">
        Find your photos from events by using your Bib number or face.
      </p>
      <div>
        <Link to="/upload" className="btn btn-primary btn-lg mx-2">
          Upload Photos
        </Link>
        <Link to="/search" className="btn btn-secondary btn-lg mx-2">
          Search Photos
        </Link>
      </div>
    </div>
  );
}

export default Home;
