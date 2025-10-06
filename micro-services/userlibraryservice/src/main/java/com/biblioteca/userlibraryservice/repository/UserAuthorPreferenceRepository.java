package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserAuthorPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAuthorPreferenceRepository extends JpaRepository<UserAuthorPreference, Integer> {
}
