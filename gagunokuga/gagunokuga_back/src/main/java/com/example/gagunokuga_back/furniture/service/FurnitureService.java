package com.example.gagunokuga_back.furniture.service;

import com.example.gagunokuga_back.furniture.dto.FurnitureListResponse;
import com.example.gagunokuga_back.furniture.dto.FurnitureResponse;


public interface FurnitureService {
    public FurnitureListResponse getFurnitureList(int page);
    public FurnitureResponse getFurniture(Long id);
}
