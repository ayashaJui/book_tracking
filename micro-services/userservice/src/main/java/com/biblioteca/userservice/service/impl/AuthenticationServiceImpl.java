package com.biblioteca.userservice.service.impl;

import com.biblioteca.userservice.dto.authUser.AuthUserDTO;
import com.biblioteca.userservice.dto.authentication.AuthUserRegistrationRequestDTO;
import com.biblioteca.userservice.dto.authentication.ResendOTPRequestDTO;
import com.biblioteca.userservice.dto.authentication.VerifyOTPDTO;
import com.biblioteca.userservice.entity.AuthUser;
import com.biblioteca.userservice.repository.AuthUserRepository;
import com.biblioteca.userservice.service.AuthenticationService;
import com.biblioteca.userservice.util.constants.Constants;
import com.biblioteca.userservice.util.enums.Authorities;
import com.biblioteca.userservice.util.exception.CustomException;
import com.biblioteca.userservice.util.exception.TooManyRequestException;
import com.biblioteca.userservice.util.mapper.AuthUserMapper;
import com.biblioteca.userservice.util.mapper.GenericMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final GenericMapper genericMapper;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${otp.validity.minutes}")
    private int otpValidity;

    @Value("${otp.retry.limit}")
    private int otpRetryLimit;

    @Value("${otp.resend.time.limit.minutes}")
    private long resendTimeLimit;

    @Override
    @Transactional
    public AuthUserDTO registerUser(AuthUserRegistrationRequestDTO registrationRequestDTO) {
        log.info("AuthenticationServiceImpl registerUser is called with EmailAddress: {}", registrationRequestDTO.getEmailAddress());

        if (!registrationRequestDTO.getPasswordHash().equals(registrationRequestDTO.getConfirmPassword())){
            log.error("Password and Confirm Password do not match for email: {}", registrationRequestDTO.getEmailAddress());
            throw new CustomException("Password and Confirm Password do not match", HttpStatus.BAD_REQUEST.value());
        }

        if (authUserRepository.findByEmailAddress(registrationRequestDTO.getEmailAddress()).isPresent()) {
            throw new CustomException("User already exists with this email", HttpStatus.CONFLICT.value());
        }

        try{
            AuthUser authUser = new AuthUser();

            authUser.setEmailAddress(registrationRequestDTO.getEmailAddress());
            authUser.setPasswordHash(passwordEncoder.encode(registrationRequestDTO.getPasswordHash()));

            // Assign USER role
            Set<String> roles = new HashSet<>();
            roles.add(Authorities.USER.name());
            authUser.setAuthorities(roles);

            authUser.setOtp(generateOTP());
            authUser.setOtpDate(LocalDateTime.now());
            authUser.setEmailVerified(false);
            authUser.setEnabled(true);
            authUser.setOtpRetryCount(1);
            authUser.setCreatedAt(LocalDateTime.now());

            authUserRepository.save(authUser);
            log.info("User registered successfully with emailAddress: {}", registrationRequestDTO.getEmailAddress());

            return AuthUserMapper.toRegisterUserDTO(authUser);

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

    @Override
    @Transactional
    public AuthUserDTO verifyOTP(VerifyOTPDTO verifyOTP) {
        log.info("AuthenticationServiceImpl verifyOTP is called with data: {}", verifyOTP.toString());

        AuthUser authUser = findById(verifyOTP.getAuthUserId());

        checkIfUserAlreadyVerified(authUser);

        if(compareOTP(authUser.getOtp(), authUser)){
            authUser.setEmailVerified(true);
            authUser.setOtp(null);
            authUser.setOtpDate(null);
            authUser.setOtpRetryCount(0);
            authUser.setUpdatedAt(LocalDateTime.now());

            try{
                authUserRepository.save(authUser);
                log.info("OTP verified successfully for user id: {}", verifyOTP.getAuthUserId());

                return convertToDto(authUser);
            }catch (Exception e){
                log.error("Error occurred while verifying OTP for user id: {}. Error: {}", verifyOTP.getAuthUserId(), e.getMessage());
                throw new CustomException("Failed to verify OTP", HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        } else {
            log.error("Otp does not match for user with data: {}", verifyOTP.toString());
            throw new CustomException("Invalid OTP", HttpStatus.BAD_REQUEST.value());
        }
    }

    @Override
    public AuthUserDTO resendOTP(ResendOTPRequestDTO resendOTPRequestDTO) {
        log.info("AuthenticationServiceImpl resendOTP is called with data: {}", resendOTPRequestDTO.toString());

        AuthUser authUser = findById(resendOTPRequestDTO.getAuthUserId());

        checkIfUserAlreadyVerified(authUser);

        if(authUser.getOtpRetryCount() >= otpRetryLimit){
            log.error("OTP retry limit exceeded for user with id: {}", resendOTPRequestDTO.getAuthUserId());
            throw new TooManyRequestException("OTP retry limit exceeded. Please contract support.", HttpStatus.TOO_MANY_REQUESTS.value(), 0);
        }

        Duration duration = null;
        if(authUser.getOtpDate() == null){
            duration = Duration.ofMinutes(resendTimeLimit+1);
        }else{
            duration = Duration.between(authUser.getOtpDate(), LocalDateTime.now());
        }

        if(duration.toMinutes() >= resendTimeLimit){
            authUser.setOtp(generateOTP());
            authUser.setOtpDate(LocalDateTime.now());
            authUser.setOtpRetryCount(authUser.getOtpRetryCount() + 1);
            authUser.setUpdatedAt(LocalDateTime.now());

            try{
                authUserRepository.save(authUser);
                log.info("OTP resent successfully for user id: {}", resendOTPRequestDTO.getAuthUserId());

                return convertToDto(authUser);
            }catch (Exception e){
                log.error("Error occurred while resending OTP for user id: {}. Error: {}", resendOTPRequestDTO.getAuthUserId(), e.getMessage());
                throw new CustomException("Failed to resend OTP", HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        } else {
            log.error("Multiple resend request in {} minute for user with id: {}", resendTimeLimit, resendOTPRequestDTO.getAuthUserId());
            throw new TooManyRequestException(String.format("Too many request. Please wait for %s minute(s)",
                    resendTimeLimit),
                    HttpStatus.TOO_MANY_REQUESTS.value(), resendTimeLimit);
        }
    }

    private void checkIfUserAlreadyVerified(AuthUser authUser) throws CustomException {
        log.info("AuthenticationService checkIfUserAlreadyVerified is called");
        if (authUser.isEmailVerified()) {
            log.error("Email already verified for user id: {}", authUser.getId());
            throw new CustomException("Email already verified", HttpStatus.BAD_REQUEST.value());
        }
    }

    private boolean compareOTP(String otp, AuthUser authUser) {
        log.info("Compare OTP is called");

        if(authUser.getOtp().equals(otp)){
            Duration duration = Duration.between(authUser.getOtpDate(), LocalDateTime.now());
            if(duration.toMinutes() > otpValidity){
                log.error("otp validity timeout for user with id: {} and otp:{}",
                        authUser.getId(), otp);
                throw new CustomException("Otp validity timeout. Please request for a new otp", HttpStatus.BAD_REQUEST.value());
            }
            return true;
        }else{
            return false;
        }
    }

    private AuthUser findById(int authUserId) {
        return authUserRepository.findById(authUserId)
                .orElseThrow(() -> {
                    log.error("User not found with id: {}", authUserId);
                    return new CustomException("User not found", HttpStatus.NOT_FOUND.value());
                });
    }

    private String generateOTP() {
        return RANDOM.ints(6, 0, Constants.CHARACTERS.length())
                .mapToObj(i -> String.valueOf(Constants.CHARACTERS.charAt(i)))
                .collect(Collectors.joining());
    }

    public AuthUserDTO convertToDto(AuthUser authUser) {
        return AuthUserMapper.toDto(authUser);
    }
}
