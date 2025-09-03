package com.biblioteca.authserver.service;

import com.biblioteca.authserver.dto.*;
import com.biblioteca.authserver.repository.AuthUserRepository;
import com.biblioteca.authserver.util.enums.UserRegistrationAPIEnums;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.security.SecureRandom;

@Service
@Slf4j

public class UserRegistrationService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private final AuthUserRepository authUserRepository;

    private final WebClient webClient;

    public UserRegistrationService(AuthUserRepository authUserRepository, WebClient.Builder webClient, @Value("${user.service.url}") String userServiceUrl) {
        this.authUserRepository = authUserRepository;
        this.webClient = webClient.baseUrl(userServiceUrl+"/userservice/v1/auth/").build();
    }

    public Mono<UserRegistrationResponseDTO> registerUser(UserRegistrationDTO userRegistrationDTO) {
        log.info("UserRegistrationResponseDTO is called with: {}", userRegistrationDTO.toString());
        return webClient.post()
                .uri(UserRegistrationAPIEnums.USER_REGISTRATION_API.value)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(userRegistrationDTO))
                .retrieve()
                .bodyToMono(UserRegistrationResponseDTO.class)
                .onErrorResume(error -> {
                    log.error("Error during user registration: {}", error.getMessage());
                    UserRegistrationResponseDTO resp = new UserRegistrationResponseDTO();

                    if(error instanceof WebClientResponseException webClientResponseException){
                        resp = webClientResponseException.getResponseBodyAs(UserRegistrationResponseDTO.class);
                    }

                    return Mono.just(resp);
                });
    }

    public Mono<UserRegistrationResponseDTO> getRegisteredUserInfo(int authUserId) {
        log.info("getRegisteredUserInfo is called with authUserId: {}", authUserId);
        return webClient.get()
                .uri(UserRegistrationAPIEnums.GET_REGISTERED_USER_INFO_API.value + "/" + authUserId)
                .retrieve()
                .bodyToMono(UserRegistrationResponseDTO.class)
                .onErrorResume(error -> {
                    log.error("Error during fetching user info: {}", error.getMessage());
                    UserRegistrationResponseDTO resp = new UserRegistrationResponseDTO();

                    if(error instanceof WebClientResponseException webClientResponseException){
                        resp = webClientResponseException.getResponseBodyAs(UserRegistrationResponseDTO.class);
                    }

                    return Mono.just(resp);
                });
    }

    public Mono<UserRegistrationResponseDTO> verifyEmailOtp(EmailOtpDTO verifyEmailOTPDTO) {
        log.info("verifyEmailOtp is called with: {}", verifyEmailOTPDTO.toString());
        return webClient.post()
                .uri(UserRegistrationAPIEnums.VERIFY_EMAIL_OTP_API.value)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(new OTPVerifyRequestDTO(verifyEmailOTPDTO.getAuthUserId(), verifyEmailOTPDTO.getOtp())))
                .retrieve()
                .bodyToMono(UserRegistrationResponseDTO.class)
                .onErrorResume(error -> {
                    log.error("Error during user registration: {}", error.getMessage());
                    UserRegistrationResponseDTO resp = new UserRegistrationResponseDTO();

                    if(error instanceof WebClientResponseException webClientResponseException){
                        resp = webClientResponseException.getResponseBodyAs(UserRegistrationResponseDTO.class);
                    }

                    return Mono.just(resp);
                });
    }

    public Mono<UserRegistrationResponseDTO> resendEmailOtp(ResendOTPRequestDTO resendOTPRequestDTO) {
        log.info("resendEmailOtp is called with authUserId: {}", resendOTPRequestDTO.getAuthUserId());
        return webClient.post()
                .uri(UserRegistrationAPIEnums.RESEND_EMAIL_OTP_API.value )
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(resendOTPRequestDTO))
                .retrieve()
                .bodyToMono(UserRegistrationResponseDTO.class)
                .onErrorResume(error -> {
                    log.error("Error during resending email OTP: {}", error.getMessage());
                    UserRegistrationResponseDTO resp = new UserRegistrationResponseDTO();

                    if(error instanceof WebClientResponseException webClientResponseException){
                        resp = webClientResponseException.getResponseBodyAs(UserRegistrationResponseDTO.class);
                    }

                    return Mono.just(resp);
                });
    }

}
