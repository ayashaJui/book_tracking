package com.biblioteca.authserver.mapper;

import com.biblioteca.authserver.entity.AuthUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AuthUserMapper {
    public UserDetails fromAuthUser(AuthUser authUser, String emailOrPhoneNo) {
        List<? extends GrantedAuthority> grantedAuthorities = (List<SimpleGrantedAuthority>) authUser.getAuthorities();

        return User.builder()
                .username(authUser.getEmailAddress())
                .password(authUser.getPasswordHash())
                .disabled(!authUser.isEnabled() || !authUser.isEmailVerified())
                .accountExpired(false)
                .accountLocked(!authUser.isAccountNonLocked())
                .credentialsExpired(!authUser.isCredentialsNonExpired())
                .authorities(grantedAuthorities)
                .build();
    }
}
