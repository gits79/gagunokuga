package com.example.gagunokuga_back.room.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class RoomListResponse {
    private int totalPages;
    private List<RoomResponse> rooms;
}
