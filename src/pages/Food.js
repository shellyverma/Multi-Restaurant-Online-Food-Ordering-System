import { useState, useEffect, useCallback } from "react";
import API from "../services/api";

const allFoods = [
  { id: 1, name: "Pizza Margherita", price: 199, image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?w=400", restaurant: "Dominos", category: "Italian", veg: true, rating: 4.5 },
  { id: 2, name: "Classic Burger", price: 99, image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?w=400", restaurant: "McDonalds", category: "Fast Food", veg: false, rating: 4.2 },
  { id: 3, name: "Creamy Pasta", price: 149, image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=400", restaurant: "Italian Hub", category: "Italian", veg: true, rating: 4.7 },
  { id: 4, name: "Club Sandwich", price: 79, image: "https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?w=400", restaurant: "Subway", category: "Fast Food", veg: true, rating: 4.0 },
  { id: 5, name: "Chicken Biryani", price: 249, image: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?w=400", restaurant: "Biryani House", category: "Indian", veg: false, rating: 4.8 },
  { id: 6, name: "Paneer Tikka", price: 179, image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?w=400", restaurant: "Punjabi Dhaba", category: "Indian", veg: true, rating: 4.6 },
  { id: 7, name: "Masala Dosa", price: 89, image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?w=400", restaurant: "South Spice", category: "Indian", veg: true, rating: 4.3 },
  { id: 8, name: "Chicken Wings", price: 199, image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?w=400", restaurant: "KFC", category: "Fast Food", veg: false, rating: 4.4 },
];

const banners = [
  { id: 1, title: "50% OFF on First Order!", subtitle: "Use code FIRST50", bg: "linear-gradient(135deg, #ff6b6b, #ee5a24)", emoji: "🎉" },
  { id: 2, title: "Free Delivery Today!", subtitle: "On orders above ₹199", bg: "linear-gradient(135deg, #0f3460, #16213e)", emoji: "🛵" },
  { id: 3, title: "New: South Indian Special", subtitle: "Authentic flavours delivered", bg: "linear-gradient(135deg, #27ae60, #2ecc71)", emoji: "🍛" },
  { id: 4, title: "Weekend Feast!", subtitle: "Extra 20% off on weekends", bg: "linear-gradient(135deg, #8e44ad, #9b59b6)", emoji: "🥳" },
];

const restaurants = ["All", "Dominos", "McDonalds", "Italian Hub", "Subway", "Biryani House", "Punjabi Dhaba", "South Spice", "KFC"];
const categories = ["All", "Indian", "Fast Food", "Italian"];

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "6px" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#f39c12" : "#ddd", fontSize: "13px" }}>★</span>
      ))}
      <span style={{ color: "#888", fontSize: "11px", marginLeft: "4px" }}>{rating}</span>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
      background: "#1a1a2e", color: "white", padding: "14px 28px",
      borderRadius: "12px", boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
      zIndex: 9999, fontSize: "15px", fontWeight: "500",
    }}>{message}</div>
  );
}

function FoodCard({ food, added, addToCart, toggleWishlist, wishlist, userRatings, rateFood, userLocation, theme }) {
  const isWishlisted = wishlist.find(w => w.id === food.id);
  const dist = userLocation && food.lat ? getDistance(userLocation.lat, userLocation.lng, food.lat, food.lng).toFixed(1) : null;
  const userRating = userRatings[food.id];

  return (
    <div style={{ background: theme.card, borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transition: "transform 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ position: "relative" }}>
        <img src={food.image} alt={food.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
        <span style={{ position: "absolute", top: "10px", left: "10px", background: food.veg ? "#27ae60" : "#e74c3c", color: "white", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
          {food.veg ? "🟢 Veg" : "🔴 Non-Veg"}
        </span>
        <button onClick={() => toggleWishlist(food)} style={{
          position: "absolute", top: "10px", right: "10px",
          background: isWishlisted ? "#ff6b6b" : "rgba(255,255,255,0.9)",
          border: "none", borderRadius: "50%", width: "36px", height: "36px",
          fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>{isWishlisted ? "❤️" : "🤍"}</button>
        {dist && <span style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.6)", color: "white", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>📍 {dist} km</span>}
      </div>
      <div style={{ padding: "16px" }}>
        <h3 style={{ margin: "0 0 4px", color: theme.text, fontSize: "17px" }}>{food.name}</h3>
        <p style={{ color: theme.subtext, fontSize: "13px", margin: "0 0 4px" }}>🏪 {food.restaurant}</p>
        <StarRating rating={userRating || food.rating} />
        <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
          <span style={{ fontSize: "12px", color: "#aaa" }}>Rate: </span>
          {[1,2,3,4,5].map(s => (
            <span key={s} onClick={() => rateFood(food.id, s)} style={{ cursor: "pointer", fontSize: "16px", color: s <= (userRating || 0) ? "#f39c12" : "#ddd" }}>★</span>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "#ff6b6b" }}>₹{food.price}</span>
          <button onClick={() => addToCart(food)} style={{
            padding: "10px 18px",
            background: added[food.id] ? "#27ae60" : "linear-gradient(135deg, #ff6b6b, #ee5a24)",
            color: "white", border: "none", borderRadius: "10px",
            fontWeight: "600", cursor: "pointer", transition: "background 0.3s", fontSize: "14px",
          }}>{added[food.id] ? "✓ Added!" : "+ Add"}</button>
        </div>
      </div>
    </div>
  );
}

function Food() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  const theme = {
    bg: darkMode ? "#0f0f0f" : "#f8f9fa",
    card: darkMode ? "#1a1a2e" : "white",
    text: darkMode ? "white" : "#1a1a2e",
    subtext: darkMode ? "#aaa" : "#666",
    border: darkMode ? "#333" : "#eee",
    input: darkMode ? "#16213e" : "white",
  };

  const [foods, setFoods] = useState(allFoods);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [restaurant, setRestaurant] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [added, setAdded] = useState({});
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist")) || []);
  const [toast, setToast] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [userRatings, setUserRatings] = useState({});
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const interval = setInterval(() => setBannerIndex(prev => (prev + 1) % banners.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    API.get("/foods").then(res => {
      if (res.data && res.data.length > 0) setFoods(res.data);
    }).catch(() => {});
  }, []);

  const showToast = useCallback((msg) => setToast(msg), []);

  const getLocation = () => {
    if (!navigator.geolocation) { setLocationStatus("Not supported"); return; }
    setLocationStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });
        const updated = allFoods.map(food => ({ ...food, lat: userLat + (Math.random()-0.5)*0.08, lng: userLng + (Math.random()-0.5)*0.08 }));
        setFoods(updated);
        setNearbyOnly(true);
        setLocationStatus("📍 Showing nearby restaurants");
        showToast("📍 Showing restaurants near you!");
      },
      () => { setLocationStatus("❌ Location denied"); setNearbyOnly(false); }
    );
  };

  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(i => i.id === item.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 1500);
    showToast(`✅ ${item.name} added to cart!`);
  };

  const toggleWishlist = (item) => {
    const exists = wishlist.find(w => w.id === item.id);
    const updated = exists ? wishlist.filter(w => w.id !== item.id) : [...wishlist, item];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    showToast(exists ? "💔 Removed from wishlist" : "❤️ Added to wishlist!");
  };

  const rateFood = (foodId, stars) => {
    setUserRatings(prev => ({ ...prev, [foodId]: stars }));
    showToast(`⭐ Rated ${stars} stars!`);
  };

  const filtered = foods.filter(food => {
    const matchSearch = food.name.toLowerCase().includes(search.toLowerCase()) || food.restaurant.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || food.category === category;
    const matchRestaurant = restaurant === "All" || food.restaurant === restaurant;
    const matchVeg = !vegOnly || food.veg;
    const matchNearby = !nearbyOnly || !userLocation || getDistance(userLocation.lat, userLocation.lng, food.lat, food.lng) <= 10;
    return matchSearch && matchCategory && matchRestaurant && matchVeg && matchNearby;
  });

  const sorted = userLocation
    ? [...filtered].sort((a, b) => getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) - getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng))
    : filtered;

  const currentBanner = banners[bannerIndex];

  const filterBtn = (active) => ({
    padding: "8px 18px", borderRadius: "20px", border: "none",
    background: active ? "#ff6b6b" : theme.card,
    color: active ? "white" : theme.subtext,
    fontWeight: "600", cursor: "pointer", fontSize: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  });

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", transition: "background 0.3s" }}>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}>

        {/* Banner */}
        <div style={{ background: currentBanner.bg, borderRadius: "20px", padding: "32px 40px", marginBottom: "16px", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.5s ease", boxShadow: "0 8px 25px rgba(0,0,0,0.15)", cursor: "pointer" }}>
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: "26px" }}>{currentBanner.title}</h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "16px" }}>{currentBanner.subtitle}</p>
          </div>
          <div style={{ fontSize: "60px" }}>{currentBanner.emoji}</div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
          {banners.map((_, i) => (
            <div key={i} onClick={() => setBannerIndex(i)} style={{ width: i === bannerIndex ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === bannerIndex ? "#ff6b6b" : "#ddd", cursor: "pointer", transition: "all 0.3s" }} />
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["all", "restaurant", "wishlist"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: activeTab === tab ? "#ff6b6b" : theme.card, color: activeTab === tab ? "white" : theme.subtext, fontWeight: "600", cursor: "pointer", fontSize: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              {tab === "all" ? "🍽 All Food" : tab === "restaurant" ? "🏪 By Restaurant" : `❤️ Wishlist (${wishlist.length})`}
            </button>
          ))}
        </div>

        {activeTab === "restaurant" && (
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            {restaurants.map(r => (
              <button key={r} onClick={() => setRestaurant(r)} style={{ padding: "8px 16px", borderRadius: "20px", border: "none", background: restaurant === r ? "#0f3460" : theme.card, color: restaurant === r ? "white" : theme.subtext, fontWeight: "600", cursor: "pointer", fontSize: "13px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>{r}</button>
            ))}
          </div>
        )}

        {activeTab === "wishlist" && (
          wishlist.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", background: theme.card, borderRadius: "16px" }}>
              <div style={{ fontSize: "50px" }}>❤️</div>
              <p style={{ color: theme.subtext, marginTop: "16px" }}>No items in wishlist yet!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {wishlist.map(food => <FoodCard key={food.id} food={food} added={added} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} userRatings={userRatings} rateFood={rateFood} userLocation={userLocation} theme={theme} />)}
            </div>
          )
        )}

        {activeTab !== "wishlist" && (
          <>
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>🔍</span>
              <input type="text" placeholder="Search food or restaurant..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "14px 16px 14px 48px", borderRadius: "12px", border: `1px solid ${theme.border}`, fontSize: "15px", outline: "none", boxSizing: "border-box", background: theme.input, color: theme.text, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              />
              {search && <span onClick={() => setSearch("")} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#aaa", fontSize: "18px" }}>✕</span>}
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              {categories.map(cat => <button key={cat} onClick={() => setCategory(cat)} style={filterBtn(category === cat)}>{cat}</button>)}
              <div onClick={() => setVegOnly(!vegOnly)} style={{ ...filterBtn(vegOnly), background: vegOnly ? "#27ae60" : theme.card, color: vegOnly ? "white" : theme.subtext }}>🟢 Veg Only</div>
              <button onClick={getLocation} style={{ ...filterBtn(nearbyOnly), background: nearbyOnly ? "#0f3460" : theme.card, color: nearbyOnly ? "white" : theme.subtext }}>📍 Nearby</button>
              {nearbyOnly && <button onClick={() => { setNearbyOnly(false); setUserLocation(null); setLocationStatus(""); setFoods(allFoods); }} style={{ padding: "8px 18px", borderRadius: "20px", border: "none", background: "#eee", color: "#555", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>✕ Clear</button>}
            </div>

            {locationStatus && <p style={{ color: "#0f3460", fontSize: "13px", marginBottom: "12px", fontWeight: "500" }}>{locationStatus}</p>}
            <p style={{ color: theme.subtext, marginBottom: "16px", fontSize: "14px" }}>{sorted.length} items found{userLocation && " • Sorted by distance"}</p>

            {sorted.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", background: theme.card, borderRadius: "16px" }}>
                <div style={{ fontSize: "50px" }}>🍽</div>
                <p style={{ color: theme.subtext, fontSize: "18px", marginTop: "16px" }}>No food found</p>
                <button onClick={() => { setSearch(""); setCategory("All"); setVegOnly(false); setNearbyOnly(false); setUserLocation(null); setLocationStatus(""); setFoods(allFoods); setRestaurant("All"); }} style={{ marginTop: "12px", padding: "10px 20px", background: "#ff6b6b", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>Clear All Filters</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {sorted.map(food => <FoodCard key={food.id} food={food} added={added} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} userRatings={userRatings} rateFood={rateFood} userLocation={userLocation} theme={theme} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Food;