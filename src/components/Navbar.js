import { Link, useNavigate } from "react-router-dom";

function Navbar({ darkMode, toggleDark, theme }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    navigate("/");
    window.location.reload();
  };

  const cartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.qty, 0);
  };

  const getAvatar = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return (payload.name || payload.sub || "U").charAt(0).toUpperCase();
      } catch (e) { return "U"; }
    }
    return "U";
  };

  return (
    <nav style={{
      background: theme.navBg,
      padding: "16px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <Link to="/foods" style={{ textDecoration: "none" }}>
        <h2 style={{ color: "white", margin: 0, fontSize: "22px" }}>FoodieHub</h2>
      </Link>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Link to="/foods" style={linkStyle}>🍽 Menu</Link>
        <Link to="/cart" style={linkStyle}>
          🛒 Cart {cartCount() > 0 && (
            <span style={{
              background: "#ff6b6b", color: "white", borderRadius: "50%",
              padding: "2px 7px", fontSize: "11px", marginLeft: "4px", fontWeight: "700",
            }}>{cartCount()}</span>
          )}
        </Link>
        <Link to="/orders" style={linkStyle}>📦 Orders</Link>

        {/* Dark Mode Toggle */}
        <button onClick={toggleDark} style={{
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "20px", padding: "6px 14px", cursor: "pointer",
          color: "white", fontSize: "16px", display: "flex", alignItems: "center", gap: "6px",
        }}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <Link to="/profile" style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: "700", fontSize: "15px",
          textDecoration: "none", flexShrink: 0,
        }}>{getAvatar()}</Link>

        <button onClick={logout} style={{
          background: "rgba(255,107,107,0.2)", color: "#ff6b6b",
          border: "1px solid rgba(255,107,107,0.3)", borderRadius: "8px",
          padding: "8px 16px", cursor: "pointer", fontSize: "14px", fontWeight: "600",
        }}>Logout</button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "rgba(255,255,255,0.85)",
  textDecoration: "none",
  fontSize: "15px",
  padding: "8px 16px",
  borderRadius: "8px",
  background: "rgba(255,255,255,0.05)",
  fontWeight: "500",
};

export default Navbar;