package com.example.gagunokuga_back.furniture.controller;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.furniture.dto.FurnitureListResponse;
import com.example.gagunokuga_back.furniture.repository.FurnitureRepository;
import com.example.gagunokuga_back.furniture.service.FurnitureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/furnitures")
@RequiredArgsConstructor
public class FurnitureController {
    private final FurnitureService furnitureService;

    // 가구 목록 불러오기
    @GetMapping
    public ResponseEntity<FurnitureListResponse> getFurnitureList(@RequestParam(defaultValue = "0") int page) {

        return ResponseEntity.ok(furnitureService.getFurnitureList(page));
    }

    // 가구 목록 저장하기
//    @PostMapping
//    public ResponseEntity
}
