package com.example.gagunokuga_back.wall.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WallListResponse {
    private List<WallResponse> walls;
}
