package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.UserPublisherPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPublisherPreferenceRepository extends JpaRepository<UserPublisherPreference, Integer> {
}
