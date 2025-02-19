package com.example.gagunokuga_back.furniture.repository;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FurnitureRepository extends JpaRepository<Furniture, Long> {
    Page<Furniture> findAll(Pageable pageable);

    @Query("SELECT f FROM Furniture f WHERE f.furnitureName LIKE %:keyword%")
    Page<Furniture> findAllByKeyword(String keyword, Pageable pageable);
    Page<Furniture> findByCategoryId(Long categoryId, Pageable pageable);
}
