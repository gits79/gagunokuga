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
public class WallServiceImpl implements WallService {
    private final WallRepository wallRepository;
    private final RoomRepository roomRepository;

    @Override
    public WallListResponse getWallsByRoomId(Long roomId) {
        List<WallResponse> walls = wallRepository.findByRoomId(roomId).stream()
                .map(WallResponse::fromEntity)
                .collect(Collectors.toList());
        return new WallListResponse(walls);
    }

    @Override
    @Transactional
    public void updateWalls(Long roomId, WallListRequest wallListRequest) {
        // 방이 존재하는지 확인
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 방입니다. roomId=" + roomId));

        // 기존 벽 정보 삭제 후 새롭게 저장
        wallRepository.deleteAll(wallRepository.findByRoomId(roomId));

        List<Wall> walls = wallListRequest.getWalls().stream()
                .map(wallRequest -> {
                    Wall wall = wallRequest.toEntity();
                    wall.setRoom(room); // Room 설정
                    return wall;
                })
                .collect(Collectors.toList());

        wallRepository.saveAll(walls);
    }
}
