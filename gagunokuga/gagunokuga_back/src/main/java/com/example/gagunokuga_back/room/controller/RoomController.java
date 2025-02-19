package com.example.gagunokuga_back.room.controller;

import com.example.gagunokuga_back.room.dto.CreateRoomRequest;
import com.example.gagunokuga_back.room.dto.RoomListResponse;
import com.example.gagunokuga_back.room.dto.RoomThumbnail;
import com.example.gagunokuga_back.room.dto.UpdateRoomNameRequest;
import com.example.gagunokuga_back.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/rooms")
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
            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok().body(roomService.getRoomList(page));
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<Void> updateRoomName(
            @PathVariable Long roomId,
            @RequestBody UpdateRoomNameRequest updateRoomNameRequest) {
        roomService.updateRoomName(roomId, updateRoomNameRequest);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/capture")
    public ResponseEntity<String> uploadImage(
            @RequestPart("image") MultipartFile image,
            @RequestParam("roomId") Long roomId) {
        System.out.println("썸네일 업로드할 룸아이디: "+roomId);
        // 이미지 업로드 처리
        String imageUrl = roomService.uploadThumbnail(roomId, image);
        // 룸 아이디를 사용하여 추가적인 처리 가능
        return ResponseEntity.ok(imageUrl);  // S3에 업로드된 이미지 URL 반환
    }
}
