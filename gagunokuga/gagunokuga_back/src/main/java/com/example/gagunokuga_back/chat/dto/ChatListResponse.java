package com.example.gagunokuga_back.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class ChatListResponse {
    private int totalCount; // 구현안되어있습니다
    private List<ChatResponse> chats;
}
