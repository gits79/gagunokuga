package com.example.gagunokuga_back.roomfurniture.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class RoomFurnitureCountResponse {
    private Long count;
}
