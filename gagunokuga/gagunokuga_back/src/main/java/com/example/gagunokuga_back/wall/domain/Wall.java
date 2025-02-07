package com.example.gagunokuga_back.wall.domain;

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
    private Integer startx;

    @Column(nullable = false)
    private Integer starty;

    @Column(nullable = false)
    private Integer endx;

    @Column(nullable = false)
    private Integer endy;

    @Column(nullable = false)
    private Integer thickness;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Transient
    private Boolean isDeleted;

    @Transient
    private Integer index;
}
