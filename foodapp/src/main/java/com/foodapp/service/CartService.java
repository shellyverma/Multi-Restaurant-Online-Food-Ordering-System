package com.foodapp.service;

import com.foodapp.model.Cart;
import com.foodapp.model.Food;
import com.foodapp.repository.CartRepository;
import com.foodapp.repository.FoodRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FoodRepository foodRepository;

    // ✅ ADD TO CART
    public Cart addToCart(Cart cart, String email) {

        // 🔥 Check user (VERY IMPORTANT)
        if (email == null) {
            throw new RuntimeException("User not authenticated");
        }

        // 🔥 Check food
        if (cart.getFood() == null || cart.getFood().getId() == null) {
            throw new RuntimeException("Food ID is required");
        }

        Long foodId = cart.getFood().getId();

        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));

        // 🔥 Set correct food from DB
        cart.setFood(food);

        // 🔥 Attach logged-in user
        cart.setUserEmail(email);

        return cartRepository.save(cart);
    }

    // ✅ GET CART ITEMS (ONLY CURRENT USER)
    public List<Cart> getCartItems(String email) {

        if (email == null) {
            throw new RuntimeException("User not authenticated");
        }

        return cartRepository.findByUserEmail(email);
    }
}