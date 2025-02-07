package com.example.gagunokuga_back.wall.repository;

import com.example.gagunokuga_back.wall.domain.Wall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WallRepository extends JpaRepository<Wall, Long> {
    List<Wall> findByRoomId(Long roomId);
}
