package com.example.gagunokuga_back.wall.repository;

import com.example.gagunokuga_back.wall.domain.Wall;
import com.example.gagunokuga_back.room.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WallRepository extends JpaRepository<Wall, Long> {
    // 특정 방(roomid)에 속한 벽 리스트 조회
    List<Wall> findByRoom(Room room);

    // 여러 벽을 한 번에 삭제하는 메서드 추가
    @Modifying
    @Query("DELETE FROM Wall w WHERE w.id IN :ids")
    void deleteAllByIdIn(@Param("ids") List<Long> ids);
}