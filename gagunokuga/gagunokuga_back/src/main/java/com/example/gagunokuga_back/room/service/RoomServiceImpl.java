package com.example.gagunokuga_back.room.service;

import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.room.dto.RoomListResponse;
import com.example.gagunokuga_back.room.dto.RoomResponse;
import com.example.gagunokuga_back.room.dto.UpdateRoomNameRequest;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private static final int PAGE_SIZE = 24;

    @Override
    public void createRoom(String roomName, String thumbnailUrl) {
        Room room = Room.builder()
                .roomName(roomName)
                .thumbnailUrl(thumbnailUrl)
                .build();
        roomRepository.save(room);
    }

    @Override
    public RoomListResponse getRoomList(int page) {
        Pageable pageable = PageRequest.of(page - 1, PAGE_SIZE);
        Page<Room> rooms = roomRepository.findAll(pageable);
        List<RoomResponse> roomList = new ArrayList<>();
        for (Room room : rooms.getContent()) {
            roomList.add(RoomResponse.builder()
                    .roomId(room.getId())
                    .roomName(room.getRoomName())
                    .thumbnailUrl(room.getThumbnailUrl())
                    .createdAt(room.getCreatedAt())
                    .createdBy(null)
                    .build());
        }
        return RoomListResponse.builder()
                .rooms(roomList)
                .totalPages(rooms.getTotalPages()).build();
    }

    @Override
    public void updateRoomName(Long roomId, UpdateRoomNameRequest updateRoomNameRequest) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if(room != null) {
            String roomName = updateRoomNameRequest.getRoomName();
            room.updateRoomName(roomName);
            roomRepository.save(room);
        }
    }

    @Override
    public void deleteRoom(Long roomId) {
        roomRepository.deleteById(roomId);
    }
}
