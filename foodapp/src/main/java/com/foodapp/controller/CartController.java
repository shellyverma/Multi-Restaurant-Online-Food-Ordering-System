package com.foodapp.controller;

import com.foodapp.model.Cart;
import com.foodapp.service.CartService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@CrossOrigin("*")
public class CartController {

    @Autowired
    private CartService cartService;

    //  Add to cart (with logged-in user)
    @PostMapping
    public Cart addToCart(@RequestBody Cart cart, HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        return cartService.addToCart(cart, email);
    }

    // Get only current user's cart
    @GetMapping
    public List<Cart> getCartItems(HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        return cartService.getCartItems(email);
    }
}