package com.example.gagunokuga_back.roomfurniture.dto;

import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import lombok.*;

import java.util.List;

@Getter
@Builder
@ToString
public class RoomFurnitureListResponse {
    private Integer totalCount;
    private List<RoomFurniture> furnitureList;
}
