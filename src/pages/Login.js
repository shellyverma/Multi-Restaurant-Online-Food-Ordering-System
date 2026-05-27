import { useState } from "react";
import API from "../services/api";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    if (isRegister && !name) {
      setError("Please enter your name");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await API.post("/auth/register", { name, email, password });
        setSuccess("Account created! Please login.");
        setIsRegister(false);
        setEmail("");
        setPassword("");
        setName("");
      } else {
        const res = await API.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data);
        window.location.href = "/foods";
      }
    } catch (err) {
      // Show specific error messages
      if (err.response?.status === 404) {
        setError("No account found with this email. Please register.");
      } else if (err.response?.status === 401) {
        setError("Invalid password. Please try again.");
      } else if (err.response?.status === 409) {
        setError("Email already registered. Please login.");
      } else {
        setError(isRegister ? "Registration failed. Try again." : "Login failed. Check your credentials.");
      }
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "40px",
        width: "360px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>🍔</div>
          <h1 style={{ color: "white", fontSize: "28px", margin: 0 }}>FoodieHub</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "6px", fontSize: "14px" }}>
            {isRegister ? "Create your account" : "Welcome back!"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(255,77,77,0.15)",
            border: "1px solid rgba(255,77,77,0.4)",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "16px",
            color: "#ff6b6b",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            background: "rgba(39,174,96,0.15)",
            border: "1px solid rgba(39,174,96,0.4)",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "16px",
            color: "#2ecc71",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            ✅ {success}
          </div>
        )}

        {/* Form Fields */}
        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            onKeyPress={handleKeyPress}
            style={inputStyle}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          onKeyPress={handleKeyPress}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyPress={handleKeyPress}
          style={inputStyle}
        />

        {/* Submit Button */}
        <button onClick={handleSubmit} disabled={loading} style={{
          ...btnStyle,
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}>
          {loading ? "⏳ Please wait..." : isRegister ? "Create Account" : "Login →"}
        </button>

        {/* Toggle Register/Login */}
        <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => { setIsRegister(!isRegister); setError(""); setSuccess(""); }}
            style={{ color: "#ff6b6b", cursor: "pointer", fontWeight: "600" }}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "14px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "12px",
  color: "white",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "600",
  marginTop: "6px",
};

export default Login;