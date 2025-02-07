package com.example.gagunokuga_back.wall.dto;

import com.example.gagunokuga_back.wall.domain.Wall;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WallResponse {
    private Long id;
    private Integer startX;
    private Integer startY;
    private Integer endX;
    private Integer endY;
    private Integer thickness;

    public static WallResponse fromEntity(Wall wall) {
        return WallResponse.builder()
                .id(wall.getId())
                .startX(wall.getStartX())
                .startY(wall.getStartY())
                .endX(wall.getEndX())
                .endY(wall.getEndY())
                .thickness(wall.getThickness())
                .build();
    }
}
