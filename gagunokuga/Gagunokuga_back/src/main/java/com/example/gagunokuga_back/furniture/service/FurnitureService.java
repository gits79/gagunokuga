package com.example.gagunokuga_back.furniture.service;

import com.example.gagunokuga_back.furniture.domain.Furniture;

import java.util.List;

public interface FurnitureService {
    public List<Furniture> getAllFurnitures(Long roomId);
}
