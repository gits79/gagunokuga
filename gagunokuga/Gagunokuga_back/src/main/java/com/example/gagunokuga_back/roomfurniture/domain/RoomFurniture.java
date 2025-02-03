package com.example.gagunokuga_back.roomfurniture.domain;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.room.domain.Room;
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

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "furniture_id")
    private Furniture furniture;
}
