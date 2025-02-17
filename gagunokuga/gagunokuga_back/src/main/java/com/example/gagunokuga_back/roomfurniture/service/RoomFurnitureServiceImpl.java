package com.example.gagunokuga_back.roomfurniture.service;

import com.example.gagunokuga_back.furniture.repository.FurnitureRepository;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import com.example.gagunokuga_back.roomfurniture.mapper.RoomFurnitureMapper;
import com.example.gagunokuga_back.roomfurniture.repository.RoomFurnitureJpaRepository;
import com.example.gagunokuga_back.roomfurniture.dto.RoomFurnitureDto;
import com.example.gagunokuga_back.websocket.dto.FurnitureEventDto;
import com.example.gagunokuga_back.websocket.dto.FurnitureListDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomFurnitureServiceImpl implements RoomFurnitureService {
    private final RoomFurnitureJpaRepository roomFurnitureRepository;
    private final RoomRepository roomRepository;
    private final FurnitureRepository furnitureRepository;

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;
    private final RoomFurnitureMapper roomFurnitureMapper = Mappers.getMapper(RoomFurnitureMapper.class);

    @Override
    public FurnitureEventDto createRoomFurniture(Long roomId, Long furnitureId, Integer xpos, Integer ypos) {  // 방에 배치된 가구 하나 생성
        String key = "room:" + roomId + ":furniture:index";
        redisTemplate.opsForValue().setIfAbsent(key, -1L);
        RoomFurniture roomFurniture = new RoomFurniture(
                roomRepository.getReferenceById(roomId),
                furnitureRepository.getReferenceById(furnitureId),
                xpos, ypos);

        RoomFurnitureDto roomFurnitureDto = roomFurnitureMapper.toRoomFurnitureDto(
                roomFurniture,
                redisTemplate.opsForValue().increment(key, 1L));
        FurnitureEventDto furnitureEventDto = FurnitureEventDto.builder()
                .event(FurnitureEventDto.Event.CREATE)
                .furniture(roomFurnitureDto).build();

        this.store(roomId, roomFurnitureDto);
        return furnitureEventDto;
    }

    public FurnitureListDto getAllRoomFurniture(Long roomId) {  // 룸 입장 시 모든 가구 데이터(+Event) 불러오기
        List<RoomFurnitureDto> roomFurnitureDtoList = this.fetchAll(roomId);
        List<FurnitureEventDto> furnitureEventDtoList = new ArrayList<>();
        for (RoomFurnitureDto roomFurnitureDto : roomFurnitureDtoList) {
            FurnitureEventDto furnitureEventDto = FurnitureEventDto.builder()
                    .event(FurnitureEventDto.Event.CREATE)
                    .furniture(roomFurnitureDto).build();
            furnitureEventDtoList.add(furnitureEventDto);
        }
        return FurnitureListDto.builder()
                .furnitureList(furnitureEventDtoList).build();
    }

    @Override
    public void saveAll(Long roomId) { // Redis -> DB
        redisTemplate.delete("room:" + roomId + ":furniture:index");
        List<RoomFurniture> toSave = new ArrayList<>();
        List<RoomFurniture> toDelete = new ArrayList<>();

        for (RoomFurnitureDto roomFurnitureDto : this.fetchAll(roomId)) {
            Long furnitureId = roomFurnitureDto.getFurnitureId();
            RoomFurniture roomFurniture = roomFurnitureMapper.toRoomFurniture(
                    roomFurnitureDto,
                    roomRepository.getReferenceById(roomId),
                    furnitureRepository.getReferenceById(furnitureId)
            );
            if (roomFurnitureDto.getIsDeleted() != null && roomFurnitureDto.getIsDeleted()) {
                toDelete.add(roomFurniture);
            } else {
                toSave.add(roomFurniture);
            }
        }
        roomFurnitureRepository.saveAll(toSave);
        roomFurnitureRepository.deleteAll(toDelete);
    }

    @Override
    public void loadAll(Long roomId) { // DB -> Redis
        redisTemplate.opsForValue().set("room:" + roomId + ":furniture:index", -1L);
        for (RoomFurniture roomFurniture : roomFurnitureRepository.findAllByRoom_Id(roomId)) {
            RoomFurnitureDto roomFurnitureDto = roomFurnitureMapper.toRoomFurnitureDto(
                    roomFurniture,
                    redisTemplate.opsForValue().increment("room:" + roomId + ":furniture:index", 1));
            this.store(roomId, roomFurnitureDto);
        }
    }

    @Override
    public List<RoomFurnitureDto> fetchAll(Long roomId) { // Redis -> ?
        List<RoomFurnitureDto> roomFurnitureDtoList = new ArrayList<>();
        for (Object furnitureDto : redisTemplate.opsForHash().entries("room:" + roomId + ":furniture").values()){
            roomFurnitureDtoList.add(objectMapper.convertValue(furnitureDto, RoomFurnitureDto.class));
        }
        return roomFurnitureDtoList;
    }

    @Override
    public void store(Long roomId, RoomFurnitureDto roomFurnitureDto) { // ? -> Redis
        redisTemplate.opsForHash().put("room:" + roomId + ":furniture", roomFurnitureDto.getIndex().toString(), roomFurnitureDto);
    }

    @Deprecated // 시간 되면 삭제된 데이터에 대한 최적화 구현해 보겠음
    @Override
    public void delete(Long roomId, RoomFurnitureDto roomFurnitureDto) { // 삭제 된 가구 Redis 에서도 지우기
        redisTemplate.opsForHash().delete("room:" + roomId + ":furniture", roomFurnitureDto.getIndex().toString());
    }

}
