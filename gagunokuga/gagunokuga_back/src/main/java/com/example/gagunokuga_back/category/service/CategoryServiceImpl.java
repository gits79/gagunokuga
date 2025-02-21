package com.example.gagunokuga_back.category.service;

import com.example.gagunokuga_back.category.domain.Category;
import com.example.gagunokuga_back.category.dto.CategoryListResponse;
import com.example.gagunokuga_back.category.dto.CategoryResponse;
import com.example.gagunokuga_back.category.repository.CategoryRepository;
import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.furniture.dto.FurnitureListResponse;
import com.example.gagunokuga_back.furniture.dto.FurnitureResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public CategoryListResponse getCategories(int page) {
        int size = 6; // 한페이지에 6개씩
        Pageable pageable = PageRequest.of(page, size); // 페이지네이션 설정
        Page<Category> categoryPage = categoryRepository.findAll(pageable);


        List<CategoryResponse> categories = new ArrayList<>();

        // 현재 페이지의 데이터만 가져옴
        for (Category category : categoryPage.getContent()) {
            categories.add(CategoryResponse.builder()
                    .id(category.getId())
                    .categoryName(category.getCategoryName())
                    .build());
        }
        return CategoryListResponse.builder()
                .totalPages(categoryPage.getTotalPages())
                .categoryList(categories)
                .build();
    }
}
