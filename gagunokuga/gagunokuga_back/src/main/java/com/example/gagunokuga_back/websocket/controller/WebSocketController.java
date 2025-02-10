package com.example.gagunokuga_back.websocket.controller;


import com.example.gagunokuga_back.roomfurniture.service.RoomFurnitureService;
import com.example.gagunokuga_back.websocket.dto.FurnitureEventDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final RoomFurnitureService roomFurnitureService;
    private final SimpMessageSendingOperations template;

    @MessageMapping("/rooms/{roomId}")
    public ResponseEntity<Void> receiveFurnitureInfo(
            @DestinationVariable Long roomId,
            FurnitureEventDto furnitureEventDto) {
        System.out.println(furnitureEventDto);
        template.convertAndSend("/sub/rooms/" + roomId, furnitureEventDto);
        roomFurnitureService.store(roomId, furnitureEventDto.getFurniture());
        return ResponseEntity.ok().build();
    }
}
