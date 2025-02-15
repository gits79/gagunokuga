package com.example.gagunokuga_back.websocket.controller;

import com.example.gagunokuga_back.websocket.dto.FurnitureEventDto;
import com.example.gagunokuga_back.websocket.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final WebSocketService webSocketService;
    private final SimpMessageSendingOperations template;

    @MessageMapping("/rooms/{roomId}")
    public void receiveFurnitureInfo(
            @DestinationVariable Long roomId,
            FurnitureEventDto furnitureEventDto) {
        System.out.println(furnitureEventDto);
        template.convertAndSend("/sub/rooms/" + roomId, furnitureEventDto);
        webSocketService.receiveFurnitureEvent(roomId, furnitureEventDto);
    }
}
