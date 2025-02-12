package com.example.gagunokuga_back.roomuser.repository;

import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.roomuser.domain.RoomUser;
import com.example.gagunokuga_back.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomUserRepository extends JpaRepository<RoomUser, Long> {
    boolean existsByRoomAndUser(Room room, User user);

    List<RoomUser> findAllByRoom(Room room);

    RoomUser findByRoomAndUser(Room room, User user);

    void deleteAllByRoom(Room room);

    @Query("SELECT r.room FROM RoomUser r WHERE r.user = :user")
    Page<Room> selectAllByUser(@Param("user") User user, Pageable pageable);

    @Query("SELECT r.room FROM RoomUser r WHERE r.user = :user AND r.isHost = true")
    List<Room> selectAllByUserAndIsHostIsTrue(@Param("user") User user);

    @Query("SELECT r.room FROM RoomUser r WHERE r.user = :user AND r.isHost = false")
    List<Room> selectAllByUserAndIsHostIsFalse(@Param("user") User user);
}
