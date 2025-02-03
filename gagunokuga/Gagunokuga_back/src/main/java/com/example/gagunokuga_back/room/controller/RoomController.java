package com.example.gagunokuga_back.room.controller;

import com.example.gagunokuga_back.room.dto.CreateRoomRequest;
import com.example.gagunokuga_back.room.dto.RoomListResponse;
import com.example.gagunokuga_back.room.dto.UpdateRoomNameRequest;
import com.example.gagunokuga_back.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController("/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<Void> createRoom(@RequestBody CreateRoomRequest createRoomRequest) {
        roomService.createRoom(createRoomRequest.getRoomName(),createRoomRequest.getThumbnailUrl());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<RoomListResponse> getRoomList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "24") int size) {
        return ResponseEntity.ok(roomService.getRoomList(page, size));
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<Void> updateRoomName(@PathVariable Long roomId, UpdateRoomNameRequest updateRoomNameRequest) {
        String roomName = updateRoomNameRequest.getRoomName();
        roomService.updateRoomName(roomId,roomName);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

}
