package com.example.gagunokuga_back.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class CreateChatRequest {
    private Long roomId;
    private String nickName;
    private String content;
}
