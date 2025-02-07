package com.example.gagunokuga_back.wall.domain;

import com.example.gagunokuga_back.common.BaseTimeEntity;
import com.example.gagunokuga_back.room.domain.Room;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "walls")
public class Wall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer startX;

    @Column(nullable = false)
    private Integer startY;

    @Column(nullable = false)
    private Integer endX;

    @Column(nullable = false)
    private Integer endY;

    @Column(nullable = false)
    private Integer thickness;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
}
