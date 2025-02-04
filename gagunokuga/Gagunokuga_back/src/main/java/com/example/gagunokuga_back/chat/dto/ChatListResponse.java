package com.example.gagunokuga_back.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class ChatListResponse {
    private List<ChatResponse> chats;
}
