package com.biblioteca.userservice.service.impl;

import com.biblioteca.userservice.dto.authUser.AuthUserDTO;
import com.biblioteca.userservice.dto.authentication.AuthUserRegistrationRequestDTO;
import com.biblioteca.userservice.entity.AuthUser;
import com.biblioteca.userservice.repository.AuthUserRepository;
import com.biblioteca.userservice.service.AuthenticationService;
import com.biblioteca.userservice.util.constants.Constants;
import com.biblioteca.userservice.util.enums.Authorities;
import com.biblioteca.userservice.util.exception.CustomException;
import com.biblioteca.userservice.util.mapper.AuthUserMapper;
import com.biblioteca.userservice.util.mapper.GenericMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final GenericMapper genericMapper;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public AuthUserDTO registerUser(AuthUserRegistrationRequestDTO registrationRequestDTO) {
        log.info("AuthenticationServiceImpl registerUser is called with EmailAddress: {}", registrationRequestDTO.getEmailAddress());

        if (!registrationRequestDTO.getPasswordHash().equals(registrationRequestDTO.getConfirmPassword())){
            log.error("Password and Confirm Password do not match for email: {}", registrationRequestDTO.getEmailAddress());
            throw new CustomException("Password and Confirm Password do not match", HttpStatus.BAD_REQUEST.value());
        }

        Optional<AuthUser> existingUser = authUserRepository.findByEmailAddress(registrationRequestDTO.getEmailAddress());

        if(existingUser.isPresent()){
            log.error("User already exists with email: {}", registrationRequestDTO.getEmailAddress());
            throw new CustomException("User already exists with this email", HttpStatus.CONFLICT.value());
        }

        try{
            AuthUser authUser = new AuthUser();
            authUser.setEmailAddress(registrationRequestDTO.getEmailAddress());
            authUser.setPasswordHash(passwordEncoder.encode(registrationRequestDTO.getPasswordHash()));

            ArrayList<String> authorities = new ArrayList<>();
            authorities.add(Authorities.USER.name());
            authUser.setAuthorities(authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet()));

            authUser.setOtp(generateOTP());
            authUser.setOtpDate(LocalDateTime.now());
            authUser.setEmailVerified(false);
            authUser.setEnabled(true);
            authUser.setOtpRetryCount(1);
            authUser.setCreatedAt(LocalDateTime.now());

            authUserRepository.save(authUser);
            log.info("User registered successfully with emailAddress: {}", registrationRequestDTO.getEmailAddress());

            return genericMapper.toDTO(authUser, AuthUserMapper::toRegisterUserDTO);

        }catch(Exception e){
            log.error("Error occurred while registering user with emailAddress: {}. Error: {}", registrationRequestDTO.getEmailAddress(), e.getMessage());
            throw new CustomException("Failed to register user", HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
    }

    @Override
    public AuthUserDTO getRegisteredUserInfo(int authUserId) {
        log.info("AuthenticationServiceImpl getRegisteredUserInfo is called with authUserId: {}", authUserId);

        if(authUserId <= 0){
            throw new CustomException("Id cannot be null", HttpStatus.BAD_REQUEST.value());
        }


        AuthUser authUser = authUserRepository.findById(authUserId)
                .orElseThrow(() -> {
                    log.error("User not found with id: {}", authUserId);
                    return new CustomException("User not found", HttpStatus.NOT_FOUND.value());
                });

        return genericMapper.toDTO(authUser, AuthUserMapper::toRegisterUserDTO);
    }

    private String generateOTP() {
        return RANDOM.ints(6, 0, Constants.CHARACTERS.length())
                .mapToObj(i -> String.valueOf(Constants.CHARACTERS.charAt(i)))
                .collect(Collectors.joining());
    }
}
