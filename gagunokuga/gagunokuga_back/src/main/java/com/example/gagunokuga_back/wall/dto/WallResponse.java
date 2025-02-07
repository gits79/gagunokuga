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
    private Integer startx;
    private Integer starty;
    private Integer endx;
    private Integer endy;
    private Integer thickness;
    private Long roomId;

    public static WallResponse fromEntity(Wall wall) {
        return WallResponse.builder()
                .id(wall.getId())
                .startx(wall.getStartx())
                .starty(wall.getStarty())
                .endx(wall.getEndx())
                .endy(wall.getEndy())
                .thickness(wall.getThickness())
                .roomId(wall.getRoom().getId())
                .build();
    }
}
