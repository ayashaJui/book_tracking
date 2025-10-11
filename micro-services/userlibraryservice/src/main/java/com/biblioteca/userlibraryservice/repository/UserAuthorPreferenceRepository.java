package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserAuthorPreference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAuthorPreferenceRepository extends JpaRepository<UserAuthorPreference, Integer> {
    Optional<UserAuthorPreference> findByUserIdAndCatalogAuthorId(Integer userId, Integer catalogAuthorId);

    Page<UserAuthorPreference> findByUserId(Integer userId, Pageable pageable);
}
