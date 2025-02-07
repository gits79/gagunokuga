package com.example.gagunokuga_back.wall.service;

import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import com.example.gagunokuga_back.wall.domain.Wall;
import com.example.gagunokuga_back.wall.dto.WallListRequest;
import com.example.gagunokuga_back.wall.dto.WallListResponse;
import com.example.gagunokuga_back.wall.dto.WallResponse;
import com.example.gagunokuga_back.wall.repository.WallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WallService {
    private final WallRepository wallRepository;
    private final RoomRepository roomRepository;

    public WallListResponse getWallsByRoomId(Long roomId) {
        List<WallResponse> walls = wallRepository.findByRoomId(roomId)
                .stream()
                .map(WallResponse::fromEntity)
                .collect(Collectors.toList());
        return new WallListResponse(walls);
    }

    @Transactional
    public void updateWalls(Long roomId, WallListRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        wallRepository.deleteAll(wallRepository.findByRoomId(roomId));

        List<Wall> walls = request.getWalls().stream()
                .map(wallRequest -> wallRequest.toEntity(room)) // Room을 넘겨줘야 한다잉
                .collect(Collectors.toList());

        wallRepository.saveAll(walls);
    }
}
