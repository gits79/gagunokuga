package com.example.gagunokuga_back.room.domain;

import com.example.gagunokuga_back.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    private LocalDateTime deletedAt;

    private String thumbnailUrl;

    public void delete() {
        this.deletedAt = LocalDateTime.now();
    }
}
