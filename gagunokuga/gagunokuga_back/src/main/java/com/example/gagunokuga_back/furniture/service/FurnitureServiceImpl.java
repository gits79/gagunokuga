package com.example.gagunokuga_back.furniture.service;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.furniture.dto.FurnitureListResponse;
import com.example.gagunokuga_back.furniture.dto.FurnitureResponse;
import com.example.gagunokuga_back.furniture.repository.FurnitureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public FurnitureListResponse getFurnitureList(int page, String keyword) {
        int size = 6; // 한페이지에 6개씩
        Pageable pageable = PageRequest.of(page, size); // 페이지네이션 설정
        Page<Furniture> furniturePage;
        if (keyword.length() == 0) {
            furniturePage = furnitureRepository.findAll(pageable);
        } else {
            furniturePage = furnitureRepository.findAllByKeyword(keyword, pageable);
        }

        List<FurnitureResponse> furnitures = new ArrayList<>();

        // 현재 페이지의 데이터만 가져옴
        for(Furniture furniture : furniturePage.getContent()){
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
                .totalPages(furniturePage.getTotalPages())
                .furnitures(furnitures)
                .build();
    }

    @Override
    public FurnitureResponse getFurniture(Long id) {
        Furniture furniture = furnitureRepository.findById(id).orElse(null);
        return FurnitureResponse.builder()
                .id(furniture.getId())
                .furnitureName(furniture.getFurnitureName())
                .imageUrl(furniture.getImageUrl())
                .width(furniture.getWidth())
                .height(furniture.getHeight())
                .build();
    }

    @Override
    public FurnitureListResponse getFurnitureListByCategory(Long categoryId, int page) {
        int size = 6; // 한페이지에 6개씩
        Pageable pageable = PageRequest.of(page, size); // 페이지네이션 설정
        Page<Furniture> furniturePage = furnitureRepository.findByCategoryId(categoryId, pageable);
//        if (keyword.length() == 0) {
//            furniturePage = furnitureRepository.findAll(pageable);
//        } else {
//            furniturePage = furnitureRepository.findAllByKeyword(keyword, pageable);
//        }

        List<FurnitureResponse> furnitures = new ArrayList<>();

        // 현재 페이지의 데이터만 가져옴
        for(Furniture furniture : furniturePage.getContent()){
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
                .totalPages(furniturePage.getTotalPages())
                .furnitures(furnitures)
                .build();
    }
}
