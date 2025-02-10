package com.example.gagunokuga_back.wall.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WallListRequest {
    private Long roomId;
    private List<WallRequest> walls;
    private List<Long> deletedWalls;
}