package com.example.gagunokuga_back.furniture.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class FurnitureResponse {
    private Long id;
    private String furnitureName;
    private String imageUrl;
    private int width;
    private int height;
    private Long categoryId;
    private String categoryName;
}
