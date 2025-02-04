package com.example.gagunokuga_back.chat.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatRequest {
    private Long roomId;
    private Long userId;
    private String content;
}
