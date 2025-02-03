package com.example.gagunokuga_back.furniture.service;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.furniture.repository.FurnitureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FurnitureServiceImpl implements FurnitureService {
    private final FurnitureRepository furnitureRepository;

    @Override
    public List<Furniture> getAllFurnitures(Long roomId) {
        return furnitureRepository.findAllByRoomId(roomId);
    }
}
