package com.example.gagunokuga_back.roomfurniture.controller;

import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import com.example.gagunokuga_back.roomfurniture.service.RoomFurnitureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms/{roomId}/furnitures")
@RequiredArgsConstructor
public class RoomFurnitureController {
    private final RoomFurnitureService roomFurnitureService;
    private final SimpMessageSendingOperations template;

    @GetMapping("/{furnitureId}")
    public ResponseEntity<Void> getRoomFurniture(
            @PathVariable("roomId") Long roomId,
            @PathVariable Long furnitureId) {
        template.convertAndSend("/sub/rooms/" + roomId, roomFurnitureService.getRoomFurniture(roomId, furnitureId));
        return ResponseEntity.ok().build();
    }

    @MessageMapping
    public ResponseEntity<Void> receiveFurnitureInfo(
            @PathVariable("roomId") Long roomId,
            RoomFurniture roomFurniture) {
        template.convertAndSend("/sub/rooms/" + roomId, roomFurniture);
        return ResponseEntity.ok().build();
    }

}
