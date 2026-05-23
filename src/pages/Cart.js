import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ padding: "30px", background: "#f5f7fa", minHeight: "100vh" }}>
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p>No items added yet</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.qty}</p>
              <p>Total: ₹{item.price * item.qty}</p>
            </div>
          ))}

          <h2>Total Bill: ₹{total}</h2>
        </>
      )}
    </div>
  );
}

export default Cart;