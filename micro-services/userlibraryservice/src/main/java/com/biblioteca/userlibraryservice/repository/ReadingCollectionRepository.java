package com.biblioteca.userlibraryservice.repository;

import com.biblioteca.userlibraryservice.entity.ReadingCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingCollectionRepository extends JpaRepository<ReadingCollection,Integer> {
}
