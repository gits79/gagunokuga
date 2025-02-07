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

    @GetMapping
    public ResponseEntity<WallListResponse> getWalls(@PathVariable Long roomId) {
        return ResponseEntity.ok(wallService.getWallsByRoomId(roomId));
    }

    @PutMapping
    public ResponseEntity<Void> updateWalls(@PathVariable Long roomId, @RequestBody WallListRequest wallListRequest) {
        wallService.updateWalls(roomId, wallListRequest);
        return ResponseEntity.ok().build();
    }
}
