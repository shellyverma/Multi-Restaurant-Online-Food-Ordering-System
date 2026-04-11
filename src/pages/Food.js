import { useState } from "react";

function Food() {
  const [cart, setCart] = useState([]);

  const foods = [
    {
      id: 1,
      name: "Pizza",
      price: 199,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
      restaurant: "Dominos"
    },
    {
      id: 2,
      name: "Burger",
      price: 99,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
      restaurant: "McDonalds"
    },
    {
      id: 3,
      name: "Pasta",
      price: 149,
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e",
      restaurant: "Italian Hub"
    },
    {
      id: 4,
      name: "Sandwich",
      price: 79,
      image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f",
      restaurant: "Subway"
    },
  ];

  const addToCart = (item) => {
    let updatedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = updatedCart.find((i) => i.id === item.id);

    if (existing) {
      existing.qty += 1;
    } else {
      updatedCart.push({ ...item, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    alert("Added to cart ✅");
  };

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        🍽 Explore Restaurants
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {foods.map((food) => (
          <div
            key={food.id}
            style={{
              width: "280px",
              margin: "15px",
              borderRadius: "12px",
              overflow: "hidden",
              background: "white",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <img src={food.image} style={{ width: "100%", height: "180px" }} />

            <div style={{ padding: "15px" }}>
              <h3>{food.name}</h3>
              <p style={{ color: "gray" }}>{food.restaurant}</p>
              <p style={{ fontWeight: "bold" }}>₹{food.price}</p>

              <button
                onClick={() => addToCart(food)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Food;