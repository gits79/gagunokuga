package com.example.gagunokuga_back.wall.dto;

import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.wall.domain.Wall;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WallRequest {
    private Integer startx;
    private Integer starty;
    private Integer endx;
    private Integer endy;
    private Integer thickness;
    private Boolean isDeleted;
    private Integer index;

    public Wall toEntity(Room room) { // Room 객체를 받아서 변환하도록 수정
        return Wall.builder()
                .startx(this.startx)
                .starty(this.starty)
                .endx(this.endx)
                .endy(this.endy)
                .thickness(this.thickness)
                .room(room) // Room을 설정
                .isDeleted(this.isDeleted)
                .index(this.index)
                .build();
    }
}
