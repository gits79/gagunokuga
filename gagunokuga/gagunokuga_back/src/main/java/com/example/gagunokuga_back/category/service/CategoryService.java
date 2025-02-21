package com.example.gagunokuga_back.category.service;

import com.example.gagunokuga_back.category.dto.CategoryListResponse;
import com.example.gagunokuga_back.category.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryListResponse getCategories(int page);
}
