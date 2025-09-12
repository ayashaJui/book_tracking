package com.biblioteca.authserver.util;

import com.biblioteca.authserver.entity.AuthUser;
import com.biblioteca.authserver.service.AuthUserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Value("${frontend.url}")
    private String frontendUrl;

    private final AuthUserService authUserService;

    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        User user = (User) authentication.getPrincipal();

        AuthUser authUser = authUserService.findByEmail(user.getUsername());

        if(authUser.isAccountNonLocked()){
            authUserService.resetLoginAttempt(authUser);
            log.info("Login attempt reset for : {}", authUser.getEmailAddress());
        }else{
            log.error("Account locked till : {}", authUser.getBlockedTo());
            throw new RuntimeException("Account locked for too many attempts till : " + authUser.getBlockedTo());
        }

        super.setDefaultTargetUrl(frontendUrl+"/dashboard");

        super.onAuthenticationSuccess(request, response, authentication);
    }
}
