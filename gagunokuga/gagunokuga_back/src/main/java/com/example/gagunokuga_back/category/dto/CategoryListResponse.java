package com.example.gagunokuga_back.category.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CategoryListResponse {
    int totalPages;
    List<CategoryResponse> categoryList;
}
