package com.example.gagunokuga_back.roomfurniture.dto;

import lombok.*;

@Getter
@Setter
@ToString
public class RoomFurnitureDto {
    private Long id;
    private String name;
    private int xPos;
    private int yPos;
    private int width;
    private int height;
    private int direction;
    private int layer;
    private boolean collapse;

    private String holderName;
    private boolean isDeleted;
    private int index;
}
