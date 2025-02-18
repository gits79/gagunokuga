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
    private Integer xpos;

    @Column(nullable = false)
    private Integer ypos;

    @Column(nullable = false)
    private Integer width;

    @Column(nullable = false)
    private Integer height;

    @Column(nullable = false)
    private Integer rotation;

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

    public RoomFurniture(Room room, Furniture furniture, Integer xpos, Integer ypos) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = furniture.getWidth();
        this.height = furniture.getHeight();
        this.rotation = 0;
        this.layer = 0;
        this.collapse = false;
        this.room = room;
        this.furniture = furniture;
    }
}
