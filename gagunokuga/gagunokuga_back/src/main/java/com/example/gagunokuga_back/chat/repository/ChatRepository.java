package com.example.gagunokuga_back.chat.repository;

import com.example.gagunokuga_back.chat.domain.Chat;
import com.example.gagunokuga_back.room.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findAllByRoomId(Long roomId);

    void deleteAllByRoom(Room room);
}
