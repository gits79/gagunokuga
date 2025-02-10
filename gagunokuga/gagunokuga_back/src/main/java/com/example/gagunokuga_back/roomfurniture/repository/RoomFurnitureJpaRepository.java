package com.example.gagunokuga_back.roomfurniture.repository;

import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomFurnitureJpaRepository extends JpaRepository<RoomFurniture, Long> {
    RoomFurniture[] findAllByRoom_Id(Long roomId);
}
