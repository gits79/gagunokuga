package com.example.gagunokuga_back.wall.domain;

import com.example.gagunokuga_back.room.domain.Room;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@ToString(exclude = "room")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "walls")
public class Wall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 벽 ID (PK)

    @Column(nullable = false)
    private Integer startx;  // 시작 x좌표

    @Column(nullable = false)
    private Integer starty;  // 시작 y좌표

    @Column(nullable = false)
    private Integer endx;  // 끝 x좌표

    @Column(nullable = false)
    private Integer endy;  // 끝 y좌표

    @Column(nullable = false)
    private Integer thickness;  // 벽 두께

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;  // 방 ID (FK)

    @Transient
    private Integer index;  // 벽 순서 (프론트에서 활용 가능)

    @Builder
    public Wall(Long id, Integer startx, Integer starty, Integer endx, Integer endy,
                Integer thickness, Room room) {
        this.id = id;
        this.startx = startx;
        this.starty = starty;
        this.endx = endx;
        this.endy = endy;
        this.thickness = thickness;
        this.room = room;
    }

    public void updateWall(int startx, int starty, int endx, int endy, int thickness) {
        this.startx = startx;
        this.starty = starty;
        this.endx = endx;
        this.endy = endy;
        this.thickness = thickness;
    }

}