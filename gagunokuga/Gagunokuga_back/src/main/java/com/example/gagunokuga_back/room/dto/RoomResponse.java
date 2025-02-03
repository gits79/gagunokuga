package com.example.gagunokuga_back.room.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Builder
@ToString
public class RoomResponse {
    private Long roomId;
    private String roomName;
    private String thumbnailUrl;
    private LocalDateTime createdAt;
    private String createdBy;
}
