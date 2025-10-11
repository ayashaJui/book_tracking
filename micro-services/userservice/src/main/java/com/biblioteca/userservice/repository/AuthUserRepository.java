package com.biblioteca.userservice.repository;

import com.biblioteca.userservice.entity.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthUserRepository extends JpaRepository<AuthUser, Integer> {
    Optional<AuthUser> findByEmailAddress(String emailAddress);

    AuthUser findAuthUsersByEmailAddress(String emailAddress);
}
