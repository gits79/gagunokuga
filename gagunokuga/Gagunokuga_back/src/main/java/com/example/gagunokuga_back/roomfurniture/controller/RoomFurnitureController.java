package com.example.gagunokuga_back.roomfurniture.controller;

import com.example.gagunokuga_back.roomfurniture.service.RoomFurnitureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RoomFurnitureController {
    private final RoomFurnitureService roomFurnitureService;
}
