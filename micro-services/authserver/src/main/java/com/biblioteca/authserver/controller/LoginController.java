package com.biblioteca.authserver.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Slf4j
public class LoginController implements ErrorController {
    @Value("${frontend.url}")
    private String frontendUrl;

    @GetMapping("/login")
    public String login(@RequestParam(value = "error", required = false) String error, Model model) {
        model.addAttribute("frontendUrl", frontendUrl);

        if (error != null && !error.trim().isEmpty()) {
            model.addAttribute("errorMessage", error);
        }

        return "login";
    }

    @GetMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        model.addAttribute("frontendUrl", frontendUrl);
        return "error";
    }
}
