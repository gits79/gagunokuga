package com.example.gagunokuga_back.room.domain;

import com.example.gagunokuga_back.common.BaseTimeEntity;
import com.example.gagunokuga_back.wall.domain.Wall;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "rooms")
public class Room extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomName;

    private String thumbnailUrl;

    public void updateRoomName(String roomName) {
        this.roomName = roomName;
    }

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Wall> walls = new ArrayList<>();

}
