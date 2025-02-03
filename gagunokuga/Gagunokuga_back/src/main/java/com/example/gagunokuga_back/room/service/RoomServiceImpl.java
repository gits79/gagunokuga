package com.example.gagunokuga_back.room.service;

import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.room.dto.RoomListResponse;
import com.example.gagunokuga_back.room.dto.RoomResponse;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{
    private final RoomRepository roomRepository;

    @Override
    public void createRoom(String roomName, String thumbnailUrl) {
        Room room = Room.builder()
                .roomName(roomName)
                .thumbnailUrl(thumbnailUrl)
                .build();
        roomRepository.save(room);
    }

    @Override
    public RoomListResponse getRoomList(int page, int size) {
        List<Room> roomList = roomRepository.findAll();
        Long totalPages = (long) roomList.size();
        List<RoomResponse> rooms = new ArrayList<>();
        for (Room room : roomList) {
            rooms.add(RoomResponse.builder()
                    .roomId(room.getId())
                    .roomName(room.getRoomName())
                    .thumbnailUrl(room.getThumbnailUrl())
                    .createdAt(room.getCreatedAt())
                    .createdBy(null)
                    .build());
        }
        return RoomListResponse.builder()
                .totalPages(totalPages)
                .rooms(rooms)
                .build();
    }

    @Override
    public void updateRoomName(Long roomId, String roomName) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if(room != null) {
            room.updateRoomName(roomName);
            roomRepository.save(room);
        }
    }

    @Override
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if(room != null) {
            room.delete();
            roomRepository.save(room);
        }
    }
}
