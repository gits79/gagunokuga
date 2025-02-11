package com.example.gagunokuga_back.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ChatResponse {
    private Long id;
    private String content;
    private Long roomId;
    private String nickname;
    private String profileImageUrl;

}
