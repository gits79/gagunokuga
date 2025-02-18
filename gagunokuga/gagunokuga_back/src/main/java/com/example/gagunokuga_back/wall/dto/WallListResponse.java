package com.example.gagunokuga_back.wall.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WallListResponse {
    private Long roomId;  // 방 ID
    private List<WallResponse> walls;  // 벽 리스트
}
