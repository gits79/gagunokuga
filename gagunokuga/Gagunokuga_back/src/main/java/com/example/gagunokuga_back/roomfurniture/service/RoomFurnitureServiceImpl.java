package com.example.gagunokuga_back.roomfurniture.service;

import com.example.gagunokuga_back.roomfurniture.repository.RoomFurnitureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoomFurnitureServiceImpl implements RoomFurnitureService {
    private final RoomFurnitureRepository roomFurnitureRepository;
}
