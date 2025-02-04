package com.example.gagunokuga_back.roomfurniture.service;

import com.example.gagunokuga_back.furniture.dto.FurnitureResponse;
import com.example.gagunokuga_back.furniture.repository.FurnitureRepository;
import com.example.gagunokuga_back.furniture.service.FurnitureService;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import com.example.gagunokuga_back.roomfurniture.repository.RoomFurnitureJpaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomFurnitureServiceImpl implements RoomFurnitureService {
    private final RoomFurnitureJpaRepository roomFurnitureRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final FurnitureService furnitureService;

    private final RoomRepository roomRepository;
    private final FurnitureRepository furnitureRepository;
    private final ConcurrentHashMap<Long, AtomicInteger> roomFurnitureIndex = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;

    @Override
    public RoomFurniture getRoomFurniture(Long roomId, Long furnitureId) {
        FurnitureResponse furnitureResponse = furnitureService.getFurniture(furnitureId);
        AtomicInteger index = roomFurnitureIndex.computeIfAbsent(roomId, k -> new AtomicInteger(0));
        RoomFurniture roomFurniture = RoomFurniture.builder()
                .xpos(0)
                .ypos(0)
                .width(furnitureResponse.getWidth())
                .height(furnitureResponse.getHeight())
                .direction(0)
                .layer(0)
                .collapse(false)
                .room(roomRepository.getReferenceById(roomId))
                .furniture(furnitureRepository.getReferenceById(furnitureId))
                .holderName(null)
                .isDeleted(false)
                .index(index.getAndIncrement())
                .build();
        roomFurniture.hideRoom();
        this.store(roomId, roomFurniture);
        return roomFurniture;
    }

    @Override
    public void saveAll(Long roomId) { // Redis -> DB
        roomFurnitureIndex.remove(roomId);
        for (RoomFurniture roomFurniture : this.fetchAll(roomId)) {
            roomFurniture.revealRoom(roomRepository.getReferenceById(roomFurniture.getTempRoomId()));
            if (roomFurniture.getIsDeleted()) {
                roomFurnitureRepository.delete(roomFurniture);
            } else {
                roomFurnitureRepository.save(roomFurniture);
            }
        }
    }

    @Override
    public void loadAll(Long roomId) { // DB -> Redis
        AtomicInteger index = roomFurnitureIndex.computeIfAbsent(roomId, k -> new AtomicInteger(0));
        for (RoomFurniture roomFurniture : roomFurnitureRepository.findAllById(Collections.singleton(roomId))) {
            roomFurniture.hideRoom();
            redisTemplate.opsForHash().put("room:furniture:" + roomId, index.getAndIncrement(), roomFurniture);
        }
    }

    @Override
    public List<RoomFurniture> fetchAll(Long roomId) {
        List<RoomFurniture> roomFurnitureList = new ArrayList<>();
        for (Object roomFurniture : redisTemplate.opsForHash().entries("room:furniture:" + roomId).values()){
            roomFurnitureList.add(objectMapper.convertValue(roomFurniture, RoomFurniture.class));
        }
        return roomFurnitureList;
    }

    @Override
    public void store(Long roomId, RoomFurniture roomFurniture) {
        redisTemplate.opsForHash().put("room:furniture:" + roomId, roomFurniture.getIndex().toString(), roomFurniture);
    }

}
