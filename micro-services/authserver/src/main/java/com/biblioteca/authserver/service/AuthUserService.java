package com.biblioteca.authserver.service;

import com.biblioteca.authserver.entity.AuthUser;
import com.biblioteca.authserver.exception.AuthServerException;
import com.biblioteca.authserver.mapper.AuthUserMapper;
import com.biblioteca.authserver.repository.AuthUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthUserService implements UserDetailsService {
    private final AuthUserRepository authUserRepository;

    private final AuthUserMapper authUserMapper;

    @Value("${user.login.block.hours}")
    private int userBlockHours;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("loadUserByUsername is running");

        AuthUser authUser = authUserRepository.findByEmailAddress(username)
                .orElseThrow(() -> new AuthServerException("No Users Found"));

        return authUserMapper.fromAuthUser(authUser, username);
    }

    public AuthUser findByEmail(String email) {
        return authUserRepository.findByEmailAddress(email).orElseThrow(() -> new AuthServerException("No User Found"));
    }

    public void blockUser(AuthUser authUser) {
        LocalDateTime blockTo = LocalDateTime.now().plusHours(userBlockHours);

        authUser.setBlockedTo(blockTo);
        authUser.setBlockedAt(LocalDateTime.now());
        authUser.setAccountNonLocked(false);

        try {
            authUserRepository.save(authUser);
        } catch (Exception e) {
            log.error("Exception in user save method: {}", e.getLocalizedMessage());
        }
    }

    public void increaseLoginAttempt(AuthUser authUser) {

        authUser.setLoginAttempt(authUser.getLoginAttempt() + 1);

        try {
            authUserRepository.save(authUser);
        } catch (Exception e) {
            log.error("Exception in user save method: {}", e.getLocalizedMessage());
        }
    }

    public AuthUser resetLoginAttempt(AuthUser authUser) {
        authUser.setLoginAttempt(0);
        authUser.setBlockedAt(null);
        authUser.setBlockedTo(null);
        authUser.setAccountNonLocked(true);

        try {
            authUserRepository.save(authUser);
        } catch (Exception e) {
            log.error("Exception in user save method: {}", e.getLocalizedMessage());

        }

        return authUser;
    }
}
