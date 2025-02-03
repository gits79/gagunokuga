package com.example.gagunokuga_back.roomfurniture.service;

import com.example.gagunokuga_back.furniture.dto.FurnitureResponse;
import com.example.gagunokuga_back.furniture.repository.FurnitureRepository;
import com.example.gagunokuga_back.furniture.service.FurnitureService;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import com.example.gagunokuga_back.roomfurniture.repository.redis.RoomFurnitureRedisRepository;
import com.example.gagunokuga_back.roomfurniture.repository.jpa.RoomFurnitureJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomFurnitureServiceImpl implements RoomFurnitureService {
    private final RoomFurnitureJpaRepository roomFurnitureRepository;
    private final RoomFurnitureRedisRepository redisRoomFurnitureRepository;
    private final FurnitureService furnitureService;

    private final RoomRepository roomRepository;
    private final FurnitureRepository furnitureRepository;

    @Override
    public RoomFurniture getRoomFurniture(Long roomId, Long furnitureId) {
        FurnitureResponse furnitureResponse = furnitureService.getFurniture(furnitureId);
        return RoomFurniture.builder()
                .xPos(0)
                .yPos(0)
                .width(furnitureResponse.getWidth())
                .height(furnitureResponse.getHeight())
                .direction(0)
                .layer(0)
                .collapse(false)
                .room(roomRepository.getOne(roomId))
                .furniture(furnitureRepository.getOne(furnitureId))
                .holderName(null)
                .isDeleted(false)
                .index(-1)
                .build();
    }

    @Override
    public void saveAll(Long roomId) { // Redis -> DB
        roomFurnitureRepository.saveAll(redisRoomFurnitureRepository.findAllById(Collections.singleton(roomId)));
    }

    @Override
    public void loadAll(Long roomId) { // DB -> Redis
        redisRoomFurnitureRepository.saveAll(roomFurnitureRepository.findAllById(Collections.singleton(roomId)));
    }

    @Override
    public List<RoomFurniture> fetchAll() {
        return (List<RoomFurniture>) redisRoomFurnitureRepository.findAll();
    }

    @Override
    public void store(RoomFurniture roomFurniture) {
        redisRoomFurnitureRepository.save(roomFurniture);
    }

}
