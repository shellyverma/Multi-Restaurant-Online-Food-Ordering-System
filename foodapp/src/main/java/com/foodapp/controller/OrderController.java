package com.foodapp.controller;

import com.foodapp.model.Order;
import com.foodapp.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ Place order for logged-in user
    @PostMapping
    public Order placeOrder(@RequestBody Order order, HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        return orderService.placeOrder(order, email);
    }

    // ✅ Get only current user's orders
    @GetMapping
    public List<Order> getOrders(HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        return orderService.getOrders(email);
    }
}