package com.example.gagunokuga_back.chat.service;

import com.example.gagunokuga_back.chat.dto.ChatListResponse;
import com.example.gagunokuga_back.chat.dto.CreateChatRequest;
import com.example.gagunokuga_back.chat.dto.ChatResponse;
import com.example.gagunokuga_back.room.domain.Room;

public interface ChatService {
    ChatListResponse getChatList(Long roomId);
    ChatResponse sendMessage(CreateChatRequest chatMessage);
    public void deleteAllByRoom(Room room);

}
