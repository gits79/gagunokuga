package com.example.gagunokuga_back.roomfurniture.controller;

import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import com.example.gagunokuga_back.roomfurniture.dto.RoomFurnitureListResponse;
import com.example.gagunokuga_back.roomfurniture.service.RoomFurnitureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms/{roomId}/furnitures")
@RequiredArgsConstructor
public class RoomFurnitureController {
    private final RoomFurnitureService roomFurnitureService;
    private final SimpMessageSendingOperations template;

    @GetMapping("/fetch")
    public ResponseEntity<RoomFurnitureListResponse> fetchAllRoomFurniture(@PathVariable("roomId") Long roomId) {
        List<RoomFurniture> roomFurnitureList = roomFurnitureService.fetchAll(roomId);
        RoomFurnitureListResponse roomFurnitureListResponse = RoomFurnitureListResponse.builder()
                .totalCount(roomFurnitureList.size())
                .furnitureList(roomFurnitureList).build();
        return ResponseEntity.ok().body(roomFurnitureListResponse);
    }

    @GetMapping("/{furnitureId}")
    public ResponseEntity<Void> getRoomFurniture(
            @PathVariable("roomId") Long roomId,
            @PathVariable Long furnitureId) {
        template.convertAndSend("/sub/rooms/" + roomId, roomFurnitureService.getRoomFurniture(roomId, furnitureId));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/save")
    public ResponseEntity<Void> saveRoomFurniture(
            @PathVariable("roomId") Long roomId) {
        roomFurnitureService.saveAll(roomId);
        return ResponseEntity.ok().build();
    }

    @MessageMapping("/rooms/{roomId}")
    public ResponseEntity<Void> receiveFurnitureInfo(
            @DestinationVariable Long roomId,
            RoomFurniture roomFurniture) {
        System.out.println(roomFurniture);
        template.convertAndSend("/sub/rooms/" + roomId, roomFurniture);
        roomFurnitureService.store(roomId, roomFurniture);
        return ResponseEntity.ok().build();
    }

}
