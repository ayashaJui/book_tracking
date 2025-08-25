package com.biblioteca.authserver.service;

import com.biblioteca.authserver.entity.AuthUser;
import com.biblioteca.authserver.exception.AuthServerException;
import com.biblioteca.authserver.mapper.AuthUserMapper;
import com.biblioteca.authserver.repository.AuthUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;

@Slf4j
@Service
public class AuthUserService  implements UserDetailsService {
    private final AuthUserRepository userRepository;

    private final AuthUserMapper authUserMapper;

    public AuthUserService(AuthUserRepository userRepository, AuthUserMapper authUserMapper) {
        this.userRepository = userRepository;
        this.authUserMapper = authUserMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String emailOrPhoneNo) throws UsernameNotFoundException {
        log.info("loadUserByUsername is running");

        AuthUser authUser = userRepository.findByEmailAddress(emailOrPhoneNo)
                .orElseThrow(() -> new AuthServerException("No Users Found"));

        return authUserMapper.fromAuthUser(authUser, emailOrPhoneNo);
    }

    public AuthUser findByEmail(String email) {
        return userRepository.findByEmailAddress(email).orElseThrow(() -> new AuthServerException("No User Found"));
    }

    public void blockUserLoginAttempt(AuthUser authUser) {

//        LocalDateTime blockedTo = LocalDateTime.now().plusHours(userBlockHours);//come from config server
//
//        authUser.setBlockedAt(LocalDateTime.now());
//        authUser.setBlockedTo(blockedTo);
//        authUser.setAccountNonLocked(false);
//        try {
//            userRepository.save(authUser);
//        } catch (Exception e) {
//            log.error("Exception in user save method: {}", e.getLocalizedMessage());
//        }
    }

    public void increaseLoginAttempt(AuthUser authUser) {
        authUser.setLoginAttempt(authUser.getLoginAttempt() + 1);
        try {
            userRepository.save(authUser);
        } catch (Exception e) {
            log.error("Exception in user save method: {}", e.getLocalizedMessage());
        }
    }

    public AuthUser resetLoginAttempt(AuthUser authUser) {

        authUser.setAccountNonLocked(true);
        authUser.setLoginAttempt(0);
        authUser.setBlockedAt(null);
        authUser.setBlockedTo(null);
        try {
            return userRepository.save(authUser);
        } catch (Exception e) {
            log.error("Exception in user save method: {}", e.getLocalizedMessage());
        }
        return authUser;
    }


    public AuthUser checkBlockedTime(AuthUser authUser) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime blockedTo = authUser.getBlockedTo();

        if (Objects.isNull(blockedTo)) return authUser;

        if (blockedTo.isBefore(now)) {
            return resetLoginAttempt(authUser);
        }
        return authUser;

    }
}
