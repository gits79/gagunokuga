package com.example.gagunokuga_back.wall.service;

import com.example.gagunokuga_back.wall.dto.WallListRequest;
import com.example.gagunokuga_back.wall.dto.WallListResponse;
import com.example.gagunokuga_back.wall.dto.WallResponse;

public interface WallService {
    WallListResponse getWallsByRoomId(Long roomId);
    void updateWalls(Long roomId, WallListRequest wallListRequest);
}
