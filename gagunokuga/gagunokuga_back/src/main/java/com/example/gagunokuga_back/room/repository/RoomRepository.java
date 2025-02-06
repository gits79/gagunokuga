package com.example.gagunokuga_back.room.repository;

import com.example.gagunokuga_back.room.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
