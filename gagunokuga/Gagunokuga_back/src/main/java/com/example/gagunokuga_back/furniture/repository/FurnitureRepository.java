package com.example.gagunokuga_back.furniture.repository;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FurnitureRepository extends JpaRepository<Furniture, Long> {
    Page<Furniture> findAll(Pageable pageable);
}
