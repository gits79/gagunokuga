package com.example.gagunokuga_back.roomfurniture.domain;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.room.domain.Room;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;

@Entity
@Getter
@ToString
@Builder
@RedisHash("room-furniture")
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

    @Transient
    private String holderName;

    @Transient
    private Boolean isDeleted;

    @Transient
    private Integer index;

    @Transient
    private Long tempRoomId;

    public void hideRoom() {
        if (this.room != null) {
            this.tempRoomId = this.room.getId();
        }
        this.room = null;
    }

    public void revealRoom(Room room) {
        this.room = room;
    }
}
