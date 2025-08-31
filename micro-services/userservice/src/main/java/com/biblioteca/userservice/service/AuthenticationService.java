package com.biblioteca.userservice.service;

import com.biblioteca.userservice.dto.authUser.AuthUserDTO;
import com.biblioteca.userservice.dto.authentication.AuthUserRegistrationRequestDTO;

public interface AuthenticationService {
    AuthUserDTO registerUser(AuthUserRegistrationRequestDTO registrationRequestDTO);

    AuthUserDTO getRegisteredUserInfo(int authUserId);
}
