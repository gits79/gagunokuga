package com.example.gagunokuga_back.wall.service;

import com.example.gagunokuga_back.wall.dto.WallListRequest;
import com.example.gagunokuga_back.wall.dto.WallListResponse;

public interface WallService {
    // 특정 방(roomId)의 벽 목록 조회
    WallListResponse getWallsByRoom(Long roomId);

    // 여러 개의 벽 추가/수정/삭제 처리
    void saveWalls(WallListRequest wallListRequest);
}
