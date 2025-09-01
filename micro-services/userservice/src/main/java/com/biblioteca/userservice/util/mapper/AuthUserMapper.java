package com.biblioteca.userservice.util.mapper;

import com.biblioteca.userservice.dto.authUser.AuthUserDTO;
import com.biblioteca.userservice.entity.AuthUser;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

public class AuthUserMapper {
    public static Set<String> fromGrantedAuthority(Collection<SimpleGrantedAuthority> grantedAuthorities) {
        if (grantedAuthorities == null) return Collections.emptySet();
        return grantedAuthorities.stream()
                .map(SimpleGrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
    }

    public static AuthUserDTO toRegisterUserDTO(AuthUser authUser){
        return AuthUserDTO.builder()
                .id(authUser.getId())
                .emailAddress(authUser.getEmailAddress())
                .authorities(authUser.getAuthorities())
                .otpDate(authUser.getOtpDate())
                .otpRetryCount(authUser.getOtpRetryCount())
                .build();
    }

    public static AuthUserDTO toDto(AuthUser authUser) {
        return AuthUserDTO.builder()
                .id(authUser.getId())
                .emailAddress(authUser.getEmailAddress())
                .authorities(authUser.getAuthorities())
                .build();
    }
}
