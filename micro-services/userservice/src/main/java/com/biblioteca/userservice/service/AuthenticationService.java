package com.biblioteca.userservice.service;

import com.biblioteca.userservice.dto.authUser.AuthUserDTO;
import com.biblioteca.userservice.dto.authentication.AuthUserRegistrationRequestDTO;
import com.biblioteca.userservice.dto.authentication.ResendOTPRequestDTO;
import com.biblioteca.userservice.dto.authentication.VerifyOTPDTO;

public interface AuthenticationService {
    AuthUserDTO registerUser(AuthUserRegistrationRequestDTO registrationRequestDTO);

    AuthUserDTO getRegisteredUserInfo(int authUserId);

    AuthUserDTO verifyOTP(VerifyOTPDTO verifyOTP);

    AuthUserDTO resendOTP(ResendOTPRequestDTO resendOTPRequestDTO);
}
