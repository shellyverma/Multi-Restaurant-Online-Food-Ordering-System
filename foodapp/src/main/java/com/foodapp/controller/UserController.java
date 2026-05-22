package com.foodapp.controller;

import com.foodapp.model.User;
import com.foodapp.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder encoder;

    // ✅ Create user (optional)
    @PostMapping
    public User createUser(@RequestBody User user) {

        // 🔥 IMPORTANT: encode password
        user.setPassword(encoder.encode(user.getPassword()));

        // 🔥 ensure correct role format
        user.setRole("ROLE_USER");

        return userService.createUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}