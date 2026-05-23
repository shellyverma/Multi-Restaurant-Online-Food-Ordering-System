import { useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  const placeOrder = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setOrders(cart);
    localStorage.removeItem("cart");
  };

  return (
    <div style={{ padding: "30px", background: "#eef2f3", minHeight: "100vh" }}>
      <h1>📦 Your Orders</h1>

      <button
        onClick={placeOrder}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "6px",
          marginBottom: "20px",
        }}
      >
        Place Order
      </button>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{item.name}</h3>
            <p>Quantity: {item.qty}</p>
            <p>Total: ₹{item.price * item.qty}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;