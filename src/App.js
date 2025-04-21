import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Creator from "./pages/Creator";
import Consumer from "./pages/Consumer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/consumer" element={<Consumer />} />
      </Routes>
    </Router>
  );
}

export default App;
