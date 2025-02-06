package com.example.gagunokuga_back.chat.controller;

import com.example.gagunokuga_back.chat.dto.ChatListResponse;
import com.example.gagunokuga_back.chat.dto.CreateChatRequest;
import com.example.gagunokuga_back.chat.dto.ChatResponse;
import com.example.gagunokuga_back.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms/{roomId}/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<ChatListResponse> getChatList(@PathVariable("roomId") Long roomId) {

        return ResponseEntity.ok(chatService.getChatList(roomId));
    }

    @MessageMapping("/{roomId}") //여기로 전송되면 메서드 호출 -> WebSocketConfig prefixes 에서 적용한건 앞에 생략
    @SendTo("/sub/{roomId}")   //구독하고 있는 장소로 메시지 전송 (목적지)  -> WebSocketConfig Broker 에서 적용한건 앞에 붙어줘야됨
    public ChatResponse chat(@DestinationVariable Long roomId, CreateChatRequest message) {

        message.setRoomId(roomId);
        //채팅 저장 및 반환
        ChatResponse response = chatService.sendMessage(message);
        return response;
    }
}
