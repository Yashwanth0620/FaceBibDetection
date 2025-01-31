import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles.css"

// Importing components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Importing pages
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Router>
      <div>
        {/* Navbar - Will appear across all pages */}
        <Navbar />
        
        {/* Routes for pages */}
        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>

        {/* Footer - Will appear across all pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
