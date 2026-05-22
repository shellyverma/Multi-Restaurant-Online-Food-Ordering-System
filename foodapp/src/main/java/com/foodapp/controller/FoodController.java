package com.foodapp.controller;

import com.foodapp.model.Food;
import com.foodapp.service.FoodService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/foods")
@CrossOrigin("*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @PostMapping
    public Food addFood(@RequestBody Food food, HttpServletRequest request) {

        String role = (String) request.getAttribute("userRole");

        // 🔥 FIXED ROLE CHECK
        if (!"ROLE_ADMIN".equals(role)) {
            throw new RuntimeException("Access Denied: Only Admin can add food");
        }

        return foodService.addFood(food);
    }

    @GetMapping
    public List<Food> getAllFoods() {
        return foodService.getAllFoods();
    }
}