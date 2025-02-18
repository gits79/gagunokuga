package com.example.gagunokuga_back.roomfurniture.controller;

import com.example.gagunokuga_back.websocket.dto.FurnitureListDto;
import com.example.gagunokuga_back.roomfurniture.service.RoomFurnitureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms/{roomId}/furnitures")
@RequiredArgsConstructor
public class RoomFurnitureController {
    private final RoomFurnitureService roomFurnitureService;
    private final SimpMessageSendingOperations template;

    @GetMapping("/fetch")   // 룸 입장 시 캐싱 된 가구 가져오기
    public ResponseEntity<FurnitureListDto> fetchAllRoomFurniture(@PathVariable("roomId") Long roomId) {
        return ResponseEntity.ok().body(roomFurnitureService.getAllRoomFurniture(roomId));
    }

    @GetMapping("/{furnitureId}")   // 배치된 가구 생성 시
    public ResponseEntity<Void> getRoomFurniture(
            @PathVariable("roomId") Long roomId,
            @PathVariable Long furnitureId,
            @RequestParam(defaultValue = "0") Integer xpos,
            @RequestParam(defaultValue = "0") Integer ypos) {
        template.convertAndSend("/sub/rooms/" + roomId, roomFurnitureService.createRoomFurniture(roomId, furnitureId, xpos, ypos));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/save")    // 저장 버튼 눌렀을 때
    public ResponseEntity<Void> saveRoomFurniture(
            @PathVariable("roomId") Long roomId) {
        roomFurnitureService.saveAll(roomId);
        return ResponseEntity.ok().build();
    }
}
