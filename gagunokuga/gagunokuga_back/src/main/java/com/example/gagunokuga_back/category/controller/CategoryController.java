package com.example.gagunokuga_back.category.controller;

import com.example.gagunokuga_back.category.dto.CategoryListResponse;
import com.example.gagunokuga_back.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;


    @GetMapping
    public ResponseEntity<CategoryListResponse> categoryList(
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(categoryService.getCategories(page));
    }

}
