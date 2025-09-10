package com.biblioteca.authserver.util;

import com.biblioteca.authserver.entity.AuthUser;
import com.biblioteca.authserver.service.AuthUserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class LoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {
    private final AuthUserService authUserService;

    @Transactional
    @SneakyThrows
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.info("onAuthenticationFailure is running");

        String email = request.getParameter("username");
        String errorMessage = "";

        try{
            AuthUser authUser = authUserService.findByEmail(email);

            if (!authUser.isEmailVerified()) {
                log.error("Login attempt with unverified email: {}", authUser.getEmailAddress());
                errorMessage = "email_unverified";
                super.setDefaultFailureUrl("/login?error=" + errorMessage);
                super.onAuthenticationFailure(request, response, exception);
                return;
            }

        }catch (Exception e){
            log.error("Error processing authentication failure", e);
            errorMessage = "failed";
        }

        super.setDefaultFailureUrl("/login?error=" + exception.getMessage());
        super.onAuthenticationFailure(request, response, exception);
    }
}
