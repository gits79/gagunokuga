package com.example.gagunokuga_back.category.dto;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryResponse {
    private Long id;
    private String categoryName;
}
