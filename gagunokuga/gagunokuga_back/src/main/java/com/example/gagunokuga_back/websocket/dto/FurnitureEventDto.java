package com.example.gagunokuga_back.websocket.dto;

import com.example.gagunokuga_back.roomfurniture.dto.RoomFurnitureDto;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class FurnitureEventDto {
    public enum Event {
        CREATE,
        UPDATE,
        DELETE
    }
    private Event event;
    private RoomFurnitureDto furniture;
}
