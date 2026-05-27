import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const COUPONS = {
  "FIRST50": { discount: 50, type: "percent", label: "50% OFF" },
  "SAVE100": { discount: 100, type: "flat", label: "₹100 OFF" },
  "FOODIE20": { discount: 20, type: "percent", label: "20% OFF" },
};

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", background: "#1a1a2e", color: "white", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 25px rgba(0,0,0,0.3)", zIndex: 9999, fontSize: "15px", fontWeight: "500" }}>
      {message}
    </div>
  );
}

function Cart() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  const theme = {
    bg: darkMode ? "#0f0f0f" : "#f8f9fa",
    card: darkMode ? "#1a1a2e" : "white",
    text: darkMode ? "white" : "#1a1a2e",
    subtext: darkMode ? "#aaa" : "#666",
    border: darkMode ? "#333" : "#eee",
    input: darkMode ? "#16213e" : "white",
  };

  const [cart, setCart] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent") return Math.round(subtotal * appliedCoupon.discount / 100);
    return appliedCoupon.discount;
  };
  const total = Math.max(0, subtotal - getDiscount());

  const updateQty = (id, delta) => {
    const updated = cart.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setToast("🗑 Item removed");
  };

  const applyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(COUPONS[code]);
      setToast(`🎉 Coupon applied! ${COUPONS[code].label}`);
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handlePayment = () => {
    if (cart.length === 0) return;
    setPaymentLoading(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: "rzp_test_St6SfBm7BOdOsl",
        amount: total * 100, currency: "INR", name: "FoodieHub",
        description: "Food Order Payment",
        handler: async function (response) {
          try { await API.post("/orders", { items: cart, totalAmount: total, paymentId: response.razorpay_payment_id }); } catch (err) {}
          localStorage.removeItem("cart");
          navigate("/orders", { state: { paid: true, paymentId: response.razorpay_payment_id, items: cart, total } });
        },
        theme: { color: "#ff6b6b" },
        modal: { ondismiss: () => setPaymentLoading(false) }
      };
      new window.Razorpay(options).open();
      setPaymentLoading(false);
    };
    document.body.appendChild(script);
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.3s" }}>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "30px 20px" }}>
        <h1 style={{ fontSize: "32px", color: theme.text, marginBottom: "24px" }}>🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: theme.card, borderRadius: "16px" }}>
            <div style={{ fontSize: "60px" }}>🛒</div>
            <p style={{ color: theme.subtext, fontSize: "18px", marginTop: "16px" }}>Your cart is empty</p>
            <button onClick={() => navigate("/foods")} style={{ marginTop: "16px", padding: "12px 24px", background: "linear-gradient(135deg, #ff6b6b, #ee5a24)", color: "white", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer", fontSize: "15px" }}>Browse Food</button>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{ background: theme.card, padding: "20px", marginBottom: "16px", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", color: theme.text }}>{item.name}</h3>
                  <p style={{ margin: 0, color: theme.subtext, fontSize: "13px" }}>🏪 {item.restaurant}</p>
                  <p style={{ margin: "6px 0 0", fontWeight: "700", color: "#ff6b6b" }}>₹{item.price * item.qty}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button onClick={() => updateQty(item.id, -1)} style={{ ...qtyBtn, background: theme.bg, color: theme.text, borderColor: theme.border }}>-</button>
                  <span style={{ fontWeight: "700", fontSize: "16px", minWidth: "20px", textAlign: "center", color: theme.text }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} style={{ ...qtyBtn, background: theme.bg, color: theme.text, borderColor: theme.border }}>+</button>
                  <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#ff4d4d", fontSize: "20px", cursor: "pointer", marginLeft: "8px" }}>🗑</button>
                </div>
              </div>
            ))}

            <div style={{ background: theme.card, padding: "20px", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 12px", color: theme.text, fontSize: "16px" }}>🎟 Apply Coupon</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <input type="text" placeholder="Enter coupon code" value={couponCode} onChange={e => { setCouponCode(e.target.value); setCouponError(""); }}
                  style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", border: `1px solid ${theme.border}`, fontSize: "14px", outline: "none", background: theme.input, color: theme.text }} />
                <button onClick={applyCoupon} style={{ padding: "12px 20px", background: "#0f3460", color: "white", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>Apply</button>
              </div>
              {couponError && <p style={{ color: "#ff4d4d", fontSize: "13px", margin: "8px 0 0" }}>❌ {couponError}</p>}
              {appliedCoupon && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", background: "#eaf3de", padding: "10px 14px", borderRadius: "8px" }}>
                  <span style={{ color: "#27ae60", fontWeight: "600", fontSize: "14px" }}>✅ {appliedCoupon.label} applied!</span>
                  <button onClick={() => { setAppliedCoupon(null); setToast("Coupon removed"); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "13px" }}>Remove</button>
                </div>
              )}
              <p style={{ color: "#aaa", fontSize: "12px", margin: "8px 0 0" }}>Try: FIRST50 • SAVE100 • FOODIE20</p>
            </div>

            <div style={{ background: theme.card, padding: "24px", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ marginBottom: "16px", color: theme.text }}>Bill Summary</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: theme.subtext }}><span>Subtotal</span><span>₹{subtotal}</span></div>
              {appliedCoupon && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#27ae60" }}><span>Discount ({appliedCoupon.label})</span><span>-₹{getDiscount()}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: theme.subtext }}><span>Delivery Fee</span><span style={{ color: "#27ae60" }}>FREE</span></div>
              <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "12px", marginTop: "12px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "18px", fontWeight: "600", color: theme.text }}>Total</span>
                <span style={{ fontSize: "22px", fontWeight: "700", color: theme.text }}>₹{total}</span>
              </div>
              <button onClick={handlePayment} disabled={paymentLoading} style={{ width: "100%", padding: "16px", marginTop: "20px", background: paymentLoading ? "#ccc" : "linear-gradient(135deg, #ff6b6b, #ee5a24)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: paymentLoading ? "not-allowed" : "pointer" }}>
                {paymentLoading ? "⏳ Loading..." : `💳 Pay ₹${total}`}
              </button>
              <p style={{ textAlign: "center", color: "#aaa", fontSize: "12px", marginTop: "12px" }}>🔒 Secure payment via Razorpay</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const qtyBtn = { width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #eee", background: "#f8f9fa", fontSize: "18px", cursor: "pointer", fontWeight: "700" };

export default Cart;