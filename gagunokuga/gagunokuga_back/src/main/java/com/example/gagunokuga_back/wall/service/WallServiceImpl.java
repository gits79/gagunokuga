package com.example.gagunokuga_back.wall.service;

import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import com.example.gagunokuga_back.wall.domain.Wall;
import com.example.gagunokuga_back.wall.dto.WallListRequest;
import com.example.gagunokuga_back.wall.dto.WallListResponse;
import com.example.gagunokuga_back.wall.dto.WallRequest;
import com.example.gagunokuga_back.wall.dto.WallResponse;
import com.example.gagunokuga_back.wall.repository.WallRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WallServiceImpl implements WallService {

    private final WallRepository wallRepository;
    private final RoomRepository roomRepository;

    @Override
    public WallListResponse getWallsByRoom(Long roomid) {
        Room room = roomRepository.findById(roomid)
                .orElseThrow(() -> new IllegalArgumentException("해당 방이 존재하지 않습니다: " + roomid));

        List<WallResponse> walls = wallRepository.findByRoom(room).stream()
                .map(wall -> new WallResponse(
                        wall.getId(),
                        roomid,
                        wall.getStartx(),
                        wall.getStarty(),
                        wall.getEndx(),
                        wall.getEndy(),
                        wall.getThickness()
                ))
                .collect(Collectors.toList());

        return new WallListResponse(roomid, walls);
    }

    @Transactional
    @Override
    public void saveWalls(WallListRequest wallListRequest) {
        Room room = roomRepository.findById(wallListRequest.getRoomid())
                .orElseThrow(() -> new IllegalArgumentException("해당 방이 존재하지 않습니다: " + wallListRequest.getRoomid()));

        // 삭제된 벽들 일괄 처리
        if (wallListRequest.getDeletedWalls() != null && !wallListRequest.getDeletedWalls().isEmpty()) {
            wallRepository.deleteAllByIdIn(wallListRequest.getDeletedWalls());
        }

        for (WallRequest wallReq : wallListRequest.getWalls()) {
            if (wallReq.getId() == null) {
                // ✅ 새 벽 추가
                Wall newWall = Wall.builder()
                        .room(room)
                        .startx(wallReq.getStartx())
                        .starty(wallReq.getStarty())
                        .endx(wallReq.getEndx())
                        .endy(wallReq.getEndy())
                        .thickness(wallReq.getThickness())
                        .build();
                wallRepository.save(newWall);
            } else {
                // ✅ 기존 벽 수정
                Wall existingWall = wallRepository.findById(wallReq.getId())
                        .orElseThrow(() -> new IllegalArgumentException("해당 벽이 존재하지 않습니다: " + wallReq.getId()));

                existingWall = Wall.builder()
                        .id(existingWall.getId())
                        .room(room)
                        .startx(wallReq.getStartx())
                        .starty(wallReq.getStarty())
                        .endx(wallReq.getEndx())
                        .endy(wallReq.getEndy())
                        .thickness(wallReq.getThickness())
                        .build();

                wallRepository.save(existingWall);
            }
        }
    }
}
