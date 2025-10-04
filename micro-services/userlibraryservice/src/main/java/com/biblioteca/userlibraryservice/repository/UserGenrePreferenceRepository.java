package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserGenrePrefernce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGenrePreferenceRepository extends JpaRepository<UserGenrePrefernce, Integer> {
}
