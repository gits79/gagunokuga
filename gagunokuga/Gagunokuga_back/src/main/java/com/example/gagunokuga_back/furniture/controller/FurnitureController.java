package com.example.gagunokuga_back.furniture.controller;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.furniture.repository.FurnitureRepository;
import com.example.gagunokuga_back.furniture.service.FurnitureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms/{roomId}/furnitures")
@RequiredArgsConstructor
public class FurnitureController {
    private final FurnitureService furnitureService;

    // 저장된 가구 목록 불러오기
    @GetMapping
    public ResponseEntity<List<Furniture>> getFurnitures(@PathVariable Long roomId) {
        List<Furniture> furnitures = furnitureService.getAllFurnitures(roomId);

        if(furnitures == null || furnitures.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(furnitures);
    }

    // 가구 목록 저장하기
//    @PostMapping
//    public ResponseEntity
}
