package com.example.gagunokuga_back.category.repository;

import com.example.gagunokuga_back.category.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
