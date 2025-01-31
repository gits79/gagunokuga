package com.example.gagunokuga_back.roomfurniture.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "room_furnitures")
public class RoomFurniture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer xPos;

    @Column(nullable = false)
    private Integer yPos;

    @Column(nullable = false)
    private Integer width;

    @Column(nullable = false)
    private Integer height;

    @Column(nullable = false)
    private Integer direction;

    @Column(nullable = false)
    private Integer layer;

    @Column(nullable = false)
    private Boolean collapse;
}
