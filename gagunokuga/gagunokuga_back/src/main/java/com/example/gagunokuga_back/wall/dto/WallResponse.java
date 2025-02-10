package com.example.gagunokuga_back.wall.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WallResponse {
    private Long id;        // 벽 ID
    private Long roomid;    // 방 ID
    private Integer startx;  // 시작 x좌표
    private Integer starty;  // 시작 y좌표
    private Integer endx;  // 끝 x좌표
    private Integer endy;  // 끝 y좌표
    private Integer thickness;  // 벽 두께
}
