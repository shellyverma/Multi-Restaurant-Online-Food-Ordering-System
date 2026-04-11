import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 40px",
        background: "linear-gradient(to right, #2c3e50, #4ca1af)",
        color: "white",
      }}
    >
      <h2 style={{ fontSize: "24px" }}>🍔 FoodieHub</h2>

      <div style={{ display: "flex", gap: "30px" }}>
        <Link to="/foods" style={linkStyle}>Food</Link>
        <Link to="/cart" style={linkStyle}>Cart</Link>
        <Link to="/orders" style={linkStyle}>Orders</Link>
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};

export default Navbar;