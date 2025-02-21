package com.example.gagunokuga_back.room.controller;

import com.example.gagunokuga_back.room.dto.*;
import com.example.gagunokuga_back.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@RequestBody CreateRoomRequest createRoomRequest) {
        return ResponseEntity.ok(roomService.createRoom(createRoomRequest.getRoomName(),createRoomRequest.getThumbnailUrl()));
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

    // 이미지 URL을 받아 프록시로 다운로드해서 반환하는 API
    @GetMapping("/proxy")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String imageUrl) {
        System.out.println("Requested URL: " + imageUrl);
        try {
            URL url = new URL(imageUrl);

            // URL 연결 확인
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            int responseCode = connection.getResponseCode();

            if (responseCode != 200) {
                System.out.println("Failed to fetch image. HTTP response code: " + responseCode);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

            // 이미지 다운로드
            InputStream inputStream = connection.getInputStream();
            byte[] imageBytes = inputStream.readAllBytes();

            // 이미지 타입 설정
            String contentType = connection.getContentType();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
