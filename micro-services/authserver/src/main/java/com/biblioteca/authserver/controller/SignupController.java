package com.biblioteca.authserver.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Slf4j
public class SignupController {
    @GetMapping("/signup")
    public String signup(Model model) {
        return "signup";
    }
}
