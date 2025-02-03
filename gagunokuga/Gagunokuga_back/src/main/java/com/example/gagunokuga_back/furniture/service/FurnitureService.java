package com.example.gagunokuga_back.furniture.service;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.furniture.dto.FurnitureListResponse;

import java.util.List;

public interface FurnitureService {
    public FurnitureListResponse getFurnitureList(int page);
}
