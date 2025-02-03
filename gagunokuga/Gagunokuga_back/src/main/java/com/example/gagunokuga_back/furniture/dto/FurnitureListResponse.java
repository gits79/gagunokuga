package com.example.gagunokuga_back.furniture.dto;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class FurnitureListResponse {
    private Long totalPages;
    private List<FurnitureResponse> furnitures;
}
