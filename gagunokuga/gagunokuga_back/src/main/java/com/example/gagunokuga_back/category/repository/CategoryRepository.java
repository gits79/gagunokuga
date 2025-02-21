package com.example.gagunokuga_back.category.repository;

import com.example.gagunokuga_back.category.domain.Category;
import com.example.gagunokuga_back.category.dto.CategoryListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAll(Pageable pageable);
}
