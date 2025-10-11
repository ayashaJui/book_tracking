package com.biblioteca.userservice.service.impl;

import com.biblioteca.userservice.dto.authUser.AuthUserDTO;
import com.biblioteca.userservice.entity.AuthUser;
import com.biblioteca.userservice.repository.AuthUserRepository;
import com.biblioteca.userservice.service.AuthUserService;
import com.biblioteca.userservice.util.exception.CustomException;
import com.biblioteca.userservice.util.mapper.AuthUserMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthUserServiceImpl implements AuthUserService {
    private final AuthUserRepository authUserRepository;


    @Override
    public AuthUserDTO getUserByEmailAddress(String emailAddress, HttpServletRequest httpServletRequest, Jwt jwt) {
        log.info("getUserByEmailAddress method in AuthUserServiceImpl is called with email: {}", emailAddress);

        AuthUser authUser = authUserRepository.findAuthUsersByEmailAddress(emailAddress);

        if(authUser == null){
            log.error("AuthUser not found in with email: {}", emailAddress);
            throw new CustomException("AuthUser not found ", HttpStatus.NOT_FOUND.value());
        }

        return convertToDTO(authUser);
    }

    private AuthUserDTO convertToDTO(AuthUser authUser) {
        return AuthUserMapper.toDto(authUser);
    }
}
