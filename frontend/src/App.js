import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { About } from "./components/About";
import { Users } from "./components/Users";
import { Login } from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  if (!user) {
    return (
      <div className="container p-4">
        <Login setUser={setUser} />
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="container p-4">
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Users user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
