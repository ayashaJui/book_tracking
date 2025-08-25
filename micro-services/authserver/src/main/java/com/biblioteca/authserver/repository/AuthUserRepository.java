package com.biblioteca.authserver.repository;

import com.biblioteca.authserver.entity.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface AuthUserRepository extends JpaRepository<AuthUser, Integer> {
    @Query("SELECT u FROM AuthUser u WHERE u.emailAddress = :emailAddress")
    Optional<AuthUser> findByEmailAddress(@Param("emailAddress") String emailAddress);

    Optional<AuthUser> findByEmailAddressAndEnabledTrue(String email);

    Optional<AuthUser> findByResetPasswordTokenAndEmailAddressAndTokenValidUptoGreaterThanEqualAndEnabledTrue(String token, String emailAddress, LocalDateTime localDateTime);
    Optional<AuthUser> findByResetPasswordTokenAndTokenValidUptoGreaterThanEqualAndEnabledTrue(String token, LocalDateTime localDateTime);
}
