package com.biblioteca.authserver.service;

import com.biblioteca.authserver.entity.AuthUser;
import com.biblioteca.authserver.exception.AuthServerException;
import com.biblioteca.authserver.repository.AuthUserRepository;
import com.biblioteca.authserver.util.mapper.AuthUserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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
}
