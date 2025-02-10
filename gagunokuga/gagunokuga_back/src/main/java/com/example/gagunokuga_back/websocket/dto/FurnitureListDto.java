package com.example.gagunokuga_back.websocket.dto;

import lombok.*;

import java.util.List;

@Getter
@Builder
@ToString
public class FurnitureListDto {
    private List<FurnitureEventDto> furnitureList;
}
