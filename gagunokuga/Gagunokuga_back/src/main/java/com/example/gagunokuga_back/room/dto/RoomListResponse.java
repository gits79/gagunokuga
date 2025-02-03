package com.example.gagunokuga_back.room.dto;

import com.example.gagunokuga_back.room.domain.Room;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class RoomListResponse {
    private Long totalPages;
    private List<RoomResponse> rooms;
}
