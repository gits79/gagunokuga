package com.example.gagunokuga_back.room.service;

import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.room.dto.RoomListResponse;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;

    @Override
    public void createRoom(String roomName, String thumbnailUrl) {
        Room room = Room.builder().roomName(roomName).thumbnailUrl(thumbnailUrl).build();
        roomRepository.save(room);
    }

    @Override
    public RoomListResponse roomList(int size, int lastId) {
        return null;
    }

    @Override
    public void updateRoomName(String roomId, String roomName) {

    }

    @Override
    public void deleteRoom(String roomId) {

    }
}
