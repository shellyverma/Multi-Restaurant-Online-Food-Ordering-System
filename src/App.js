import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Food from "./pages/Food";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  const token = localStorage.getItem("token");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  const toggleDark = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("darkMode", newVal);
  };

  const theme = {
    bg: darkMode ? "#0f0f0f" : "#f8f9fa",
    card: darkMode ? "#1a1a2e" : "white",
    text: darkMode ? "#ffffff" : "#1a1a2e",
    subtext: darkMode ? "#aaaaaa" : "#666666",
    border: darkMode ? "#333" : "#eee",
    navBg: darkMode ? "#000000" : "linear-gradient(135deg, #1a1a2e, #16213e)",
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", transition: "background 0.3s" }}>
      <BrowserRouter>
        {token && <Navbar darkMode={darkMode} toggleDark={toggleDark} theme={theme} />}
        <Routes>
          <Route path="/" element={<Login theme={theme} />} />
          <Route path="/foods" element={<PrivateRoute><Food theme={theme} /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart theme={theme} /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders theme={theme} /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile theme={theme} /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;