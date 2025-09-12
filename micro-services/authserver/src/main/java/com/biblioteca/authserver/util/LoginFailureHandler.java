package com.biblioteca.authserver.util;

import com.biblioteca.authserver.entity.AuthUser;
import com.biblioteca.authserver.service.AuthUserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
@RequiredArgsConstructor
public class LoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {
    private final AuthUserService authUserService;

    @Value("${user.login.max.attempt}")
    private int maxLoginAttempt ;

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
            }else{
                if(authUser.isAccountNonLocked()){
                    if(authUser.getLoginAttempt() == maxLoginAttempt - 1){
                        authUserService.blockUser(authUser);
                        log.error("Account blocked for too many attempts : {}", authUser.getEmailAddress());
                        errorMessage = "account_locked&blocked=" + authUser.getBlockedTo().format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm"));
                    }else{
                        authUserService.increaseLoginAttempt(authUser);
                        int attemptsLeft = maxLoginAttempt - authUser.getLoginAttempt();
                        log.error("Invalid credentials. Attempts left: {} for user: {}", attemptsLeft, authUser.getEmailAddress());
                        errorMessage = "invalid_credentials";
                    }
                }else{
                    log.error("Account locked till : {}", authUser.getBlockedTo());
                    errorMessage = "account_locked&blocked=" + authUser.getBlockedTo().format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm"));
                }
            }

        }catch (Exception e){
            log.error("Error processing authentication failure", e);
            errorMessage = "failed";
        }

        super.setDefaultFailureUrl("/login?error=" + errorMessage);
        super.onAuthenticationFailure(request, response, exception);
    }
}
