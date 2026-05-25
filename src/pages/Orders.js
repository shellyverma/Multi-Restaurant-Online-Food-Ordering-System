import { useLocation } from "react-router-dom";

function Orders() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  const theme = {
    bg: darkMode ? "#0f0f0f" : "#f8f9fa",
    card: darkMode ? "#1a1a2e" : "white",
    text: darkMode ? "white" : "#1a1a2e",
    subtext: darkMode ? "#aaa" : "#888",
  };

  const location = useLocation();
  const { paid, paymentId, items, total } = location.state || {};

  if (!paid) {
    return (
      <div style={{ background: theme.bg, minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px 20px", textAlign: "center" }}>
          <div style={{ background: theme.card, borderRadius: "16px", padding: "60px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "60px" }}>📦</div>
            <h2 style={{ color: theme.text, marginTop: "16px" }}>No Orders Yet</h2>
            <p style={{ color: theme.subtext }}>Add items to cart and place an order</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px 20px" }}>
        <div style={{ background: "linear-gradient(135deg, #27ae60, #2ecc71)", borderRadius: "20px", padding: "30px", textAlign: "center", color: "white", marginBottom: "24px", boxShadow: "0 8px 25px rgba(39,174,96,0.3)" }}>
          <div style={{ fontSize: "50px" }}>✅</div>
          <h2 style={{ margin: "12px 0 6px", fontSize: "24px" }}>Payment Successful!</h2>
          <p style={{ opacity: 0.9, margin: "0 0 12px" }}>Your food is being prepared 🍳</p>
          {paymentId && <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "8px 16px", display: "inline-block", fontSize: "13px" }}>Payment ID: {paymentId}</div>}
        </div>

        <h3 style={{ color: theme.text, marginBottom: "16px" }}>📋 Order Summary</h3>
        {items && items.map(item => (
          <div key={item.id} style={{ background: theme.card, padding: "20px", marginBottom: "12px", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", color: theme.text }}>{item.name}</h3>
              <p style={{ margin: 0, color: theme.subtext, fontSize: "13px" }}>Qty: {item.qty} × ₹{item.price}</p>
            </div>
            <span style={{ fontWeight: "700", color: "#ff6b6b", fontSize: "18px" }}>₹{item.price * item.qty}</span>
          </div>
        ))}

        <div style={{ background: theme.card, padding: "20px", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "18px", fontWeight: "600", color: theme.text }}>Total Paid</span>
          <span style={{ fontSize: "24px", fontWeight: "700", color: "#27ae60" }}>₹{total}</span>
        </div>

        <div style={{ background: theme.card, borderRadius: "16px", padding: "24px", marginTop: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ marginBottom: "20px", color: theme.text }}>🚴 Order Status</h3>
          {["Order Placed", "Being Prepared", "Out for Delivery", "Delivered"].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: i === 0 ? "#27ae60" : theme.bg, display: "flex", alignItems: "center", justifyContent: "center", color: i === 0 ? "white" : theme.subtext, fontWeight: "700", fontSize: "14px", flexShrink: 0 }}>
                {i === 0 ? "✓" : i + 1}
              </div>
              <span style={{ color: i === 0 ? "#27ae60" : theme.subtext, fontWeight: i === 0 ? "600" : "400" }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Orders;