package com.biblioteca.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@ToString
@Table(name = "auth_users")
public class AuthUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email_address", nullable = false, unique = true, columnDefinition = "nvarchar(100)")
    private String emailAddress;

    @Column(name = "password_hash", nullable = false, columnDefinition = "nvarchar()")
    private String passwordHash;

    @Column(name = "enabled", nullable = false, columnDefinition = "bit default 1")
    private boolean enabled = true;

    @Column(name = "account_non_expired", nullable = false, columnDefinition = "bit default 1")
    private boolean accountNonExpired = true;

    @Column(name = "account_non_locked", nullable = false, columnDefinition = "bit default 1")
    private boolean accountNonLocked = true;

    @Column(name = "credentials_non_expired", nullable = false, columnDefinition = "bit default 1")
    private boolean credentialsNonExpired = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "blocked_at")
    private LocalDateTime blockedAt;

    @Column(name = "blocked_to")
    private LocalDateTime blockedTo;

    @Column(name = "login_attempt", nullable = false)
    private int loginAttempt = 0;

    @Column(name = "otp_retry_count")
    private Integer otpRetryCount;

    @Column(name = "otp_date")
    private LocalDateTime otpDate;

    @Column(name = "email_verified", nullable = false, columnDefinition = "bit default 0")
    private boolean emailVerified = false;

    @Column(name = "reset_password_token", columnDefinition = "nvarchar(255)")
    private String resetPasswordToken;

    @Column(name = "token_valid_upto")
    private LocalDateTime tokenValidUpto;

    @Column(name = "otp")
    private String otp;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_authorities", joinColumns = @JoinColumn(name = "id"))
    @Column(name = "authority", nullable = false)
    private Set<SimpleGrantedAuthority> authorities;


}
