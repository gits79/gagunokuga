package com.example.gagunokuga_back.chat.service;

import com.example.gagunokuga_back.chat.dto.ChatListResponse;
import com.example.gagunokuga_back.chat.dto.ChatRequest;
import com.example.gagunokuga_back.chat.dto.ChatResponse;

public interface ChatService {
    ChatListResponse getChatList(Long roomId);
    ChatResponse sendMessage(ChatRequest chatMessage);

}
