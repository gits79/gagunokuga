package com.example.gagunokuga_back.wall.controller;

import com.example.gagunokuga_back.wall.dto.WallListRequest;
import com.example.gagunokuga_back.wall.dto.WallListResponse;
import com.example.gagunokuga_back.wall.service.WallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms/{roomId}/walls")
@RequiredArgsConstructor
public class WallController {

    private final WallService wallService;

    // ✅ 특정 방의 벽 목록 조회
    @GetMapping
    public ResponseEntity<WallListResponse> getWalls(@PathVariable Long roomId) {
        WallListResponse response = wallService.getWallsByRoom(roomId);
        return ResponseEntity.ok(response);
    }

    // ✅ 벽 추가/수정/삭제 (PUT 요청)
    @PutMapping
    public ResponseEntity<Void> saveWalls(@PathVariable Long roomId, @RequestBody WallListRequest request) {
        request.setRoomId(roomId);
        wallService.saveWalls(request);
        return ResponseEntity.ok().build();
    }
}
