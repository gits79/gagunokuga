package com.example.gagunokuga_back.furniture.service;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.furniture.dto.FurnitureListResponse;
import com.example.gagunokuga_back.furniture.dto.FurnitureResponse;
import com.example.gagunokuga_back.furniture.repository.FurnitureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FurnitureServiceImpl implements FurnitureService {
    private final FurnitureRepository furnitureRepository;

    @Override
    public FurnitureListResponse getFurnitureList() {
        List<Furniture> furnitureList = furnitureRepository.findAll();
        Long totalPages = (long) furnitureList.size();
        List<FurnitureResponse> furnitures = new ArrayList<>();
        for(Furniture furniture : furnitureList){
            furnitures.add(FurnitureResponse.builder()
                            .id(furniture.getId())
                            .furnitureName(furniture.getFurnitureName())
                            .imageUrl(furniture.getImageUrl())
                            .width(furniture.getWidth())
                            .height(furniture.getHeight())
                            .categoryId(furniture.getCategory().getId())
                            .categoryName(furniture.getCategory().getCategoryName())
                            .build());
        }
        return FurnitureListResponse.builder()
                .totalPages(totalPages)
                .furnitures(furnitures)
                .build();
    }
}
