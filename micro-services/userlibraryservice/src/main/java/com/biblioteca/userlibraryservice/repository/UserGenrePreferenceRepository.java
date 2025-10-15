package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserGenrePreference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGenrePreferenceRepository extends JpaRepository<UserGenrePreference, Integer> {
    Optional<UserGenrePreference> findByUserIdAndCatalogGenreId(Integer userId, Integer catalogGenreId);

    Page<UserGenrePreference> findByUserId(Integer userId, Pageable pageable);

    List<UserGenrePreference> findByUserId(Integer userId);
}
