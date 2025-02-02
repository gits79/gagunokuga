package com.example.gagunokuga_back.room.controller;

import com.example.gagunokuga_back.room.dto.CreateRoomRequest;
import com.example.gagunokuga_back.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<Void> createRoom(@RequestBody CreateRoomRequest createRoomRequest) {
        roomService.createRoom(createRoomRequest.getRoomName(),createRoomRequest.getThumbnailUrl());
        return ResponseEntity.noContent().build();
    }

}
