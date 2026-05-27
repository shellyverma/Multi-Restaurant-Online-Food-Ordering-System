import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  const theme = {
    bg: darkMode ? "#0f0f0f" : "#f8f9fa",
    card: darkMode ? "#1a1a2e" : "white",
    text: darkMode ? "white" : "#1a1a2e",
    subtext: darkMode ? "#aaa" : "#888",
    border: darkMode ? "#333" : "#eee",
    input: darkMode ? "#16213e" : "white",
  };

  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "FoodieHub User", email: "" });
  const [orderHistory, setOrderHistory] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ name: payload.name || "FoodieHub User", email: payload.sub || "" });
        setNewName(payload.name || "FoodieHub User");
      } catch (e) {}
    }
    setOrderHistory(JSON.parse(localStorage.getItem("orderHistory")) || []);
  }, []);

  const handleSave = () => { setUser(prev => ({ ...prev, name: newName })); setEditing(false); };
  const totalOrders = orderHistory.length;
  const totalSpent = orderHistory.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.3s" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px 20px" }}>

        <div style={{ background: "linear-gradient(135deg, #1a1a2e, #0f3460)", borderRadius: "20px", padding: "30px", display: "flex", alignItems: "center", gap: "24px", marginBottom: "24px", color: "white" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #ff6b6b, #ee5a24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700", flexShrink: 0 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "none", fontSize: "16px", outline: "none", flex: 1 }} />
                <button onClick={handleSave} style={{ padding: "8px 16px", background: "#27ae60", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Save</button>
                <button onClick={() => setEditing(false)} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h2 style={{ margin: 0, fontSize: "24px" }}>{user.name}</h2>
                <button onClick={() => setEditing(true)} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "none", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontSize: "13px" }}>✏️ Edit</button>
              </div>
            )}
            <p style={{ margin: "6px 0 0", opacity: 0.7, fontSize: "14px" }}>{user.email || "user@foodiehub.com"}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Orders", value: totalOrders, icon: "📦", color: "#ff6b6b" },
            { label: "Total Spent", value: `₹${totalSpent}`, icon: "💰", color: "#27ae60" },
            { label: "Member Since", value: "2026", icon: "⭐", color: "#f39c12" },
          ].map((stat, i) => (
            <div key={i} style={{ background: theme.card, borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: stat.color }}>{stat.value}</div>
              <div style={{ color: theme.subtext, fontSize: "13px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: theme.card, borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 16px", color: theme.text }}>Quick Actions</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/foods")} style={actionBtn("#ff6b6b")}>🍽 Browse Food</button>
            <button onClick={() => navigate("/orders")} style={actionBtn("#0f3460")}>📦 My Orders</button>
            <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("cart"); navigate("/"); }} style={actionBtn("#e74c3c")}>🚪 Logout</button>
          </div>
        </div>

        <div style={{ background: theme.card, borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", color: theme.text }}>📋 Order History</h3>
          {orderHistory.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: theme.subtext }}>
              <div style={{ fontSize: "40px" }}>📭</div>
              <p style={{ marginTop: "12px" }}>No orders yet!</p>
              <button onClick={() => navigate("/foods")} style={{ marginTop: "12px", padding: "10px 20px", background: "linear-gradient(135deg, #ff6b6b, #ee5a24)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>Browse Food</button>
            </div>
          ) : (
            orderHistory.map((order, i) => (
              <div key={i} style={{ border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "600", color: theme.text }}>Order #{i + 1}</span>
                  <span style={{ color: "#27ae60", fontWeight: "700" }}>₹{order.total}</span>
                </div>
                <p style={{ color: theme.subtext, fontSize: "13px", margin: "4px 0 0" }}>{order.items?.length} items</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const actionBtn = (bg) => ({ padding: "10px 20px", background: bg, color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" });

export default Profile;