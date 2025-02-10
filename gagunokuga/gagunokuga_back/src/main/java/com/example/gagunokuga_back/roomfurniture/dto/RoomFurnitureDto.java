package com.example.gagunokuga_back.roomfurniture.dto;

import lombok.*;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@ToString
@RedisHash("furniture-dto")
@NoArgsConstructor
@AllArgsConstructor
public class RoomFurnitureDto {
    private Long id;

    private Long furnitureId;
    private String furnitureName;
    private String imageUrl;

    private Long roomId;

    private Integer xpos;
    private Integer ypos;
    private Integer width;
    private Integer height;
    private Integer rotation;
    private Integer layer;
    private Boolean collapse;
    private String holderName;
    private Boolean isDeleted;
    private Long index;
}
