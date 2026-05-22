package com.foodapp.service;

import com.foodapp.model.Order;
import com.foodapp.model.Cart;
import com.foodapp.repository.OrderRepository;
import com.foodapp.repository.CartRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    public Order placeOrder(Order order, String email) {

        if (order.getCartItems() == null || order.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart items are empty");
        }

        List<Cart> updatedCartItems = new ArrayList<>();
        double total = 0;

        for (Cart cart : order.getCartItems()) {

            if (cart.getId() == null) {
                throw new RuntimeException("Cart ID missing");
            }

            Cart fullCart = cartRepository.findById(cart.getId())
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            // 🔐 SECURITY CHECK
            if (!fullCart.getUserEmail().equals(email)) {
                throw new RuntimeException("Unauthorized access");
            }

            updatedCartItems.add(fullCart);

            // 🔥 CALCULATE TOTAL
            total += fullCart.getFood().getPrice() * fullCart.getQuantity();
        }

        order.setCartItems(updatedCartItems);
        order.setUserEmail(email);
        order.setTotalAmount(total); // 🔥 FIXED

        return orderRepository.save(order);
    }

    public List<Order> getOrders(String email) {
        return orderRepository.findByUserEmail(email);
    }
}