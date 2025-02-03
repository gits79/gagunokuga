package com.example.gagunokuga_back.chat.controller;

import com.example.gagunokuga_back.chat.domain.Chat;
import com.example.gagunokuga_back.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rooms/{roomId}/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping
    public List<Chat> getChats(@PathVariable String roomId) {

    }
}
