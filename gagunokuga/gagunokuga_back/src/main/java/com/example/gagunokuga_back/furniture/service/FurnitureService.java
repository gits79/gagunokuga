package com.example.gagunokuga_back.furniture.service;

import com.example.gagunokuga_back.furniture.dto.FurnitureListResponse;


public interface FurnitureService {
    public FurnitureListResponse getFurnitureList(int page);
}
