package com.example.gagunokuga_back.room.repository;

import com.example.gagunokuga_back.room.domain.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoomRepository extends JpaRepository<Room, Long> {
    // 전체 룸 중에 현재 사용자가 있는 방들을 찾음
    @Query("SELECT r FROM Room r JOIN RoomUser ru ON r.id = ru.room.id WHERE ru.user.id = :userId")
    Page<Room> findRoomsByUserId(@Param("userId") Long userId, Pageable pageable);
}