package com.example.gagunokuga_back.roomfurniture.dto;

import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import lombok.*;

@Getter
@Setter
@Builder
@ToString
public class RoomFurniturePayload {
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

    public RoomFurniturePayload entityToPayload(RoomFurniture roomFurniture) {
        this.name = roomFurniture.getFurniture().getFurnitureName();
        this.xPos = roomFurniture.getXpos();
        this.yPos = roomFurniture.getYpos();
        this.width = roomFurniture.getWidth();
        this.height = roomFurniture.getHeight();
        this.direction = roomFurniture.getDirection();
        this.layer = roomFurniture.getLayer();
        this.collapse = roomFurniture.getCollapse();
        this.holderName = roomFurniture.getHolderName();
        this.isDeleted = roomFurniture.getIsDeleted();
        this.index = roomFurniture.getIndex();
        return this;
    }

}
