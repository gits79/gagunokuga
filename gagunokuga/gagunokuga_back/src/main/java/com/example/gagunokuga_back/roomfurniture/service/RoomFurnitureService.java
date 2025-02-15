package com.example.gagunokuga_back.roomfurniture.service;

import com.example.gagunokuga_back.roomfurniture.dto.RoomFurnitureDto;
import com.example.gagunokuga_back.websocket.dto.FurnitureEventDto;
import com.example.gagunokuga_back.websocket.dto.FurnitureListDto;

import java.util.List;

public interface RoomFurnitureService {
    public FurnitureEventDto createRoomFurniture(Long roomId, Long furnitureId, Integer xpos, Integer ypos);
    public FurnitureListDto getAllRoomFurniture(Long roomId);
    public void saveAll(Long roomId);
    public void loadAll(Long roomId);
    public List<RoomFurnitureDto> fetchAll(Long roomId);
    public void store(Long roomId, RoomFurnitureDto roomFurnitureDto);
    public void delete(Long roomId, RoomFurnitureDto roomFurnitureDto);
}
