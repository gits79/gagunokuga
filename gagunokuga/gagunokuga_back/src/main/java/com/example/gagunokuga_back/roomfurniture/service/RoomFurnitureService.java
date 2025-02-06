package com.example.gagunokuga_back.roomfurniture.service;

import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;

import java.util.List;

public interface RoomFurnitureService {
    public RoomFurniture getRoomFurniture(Long roomId, Long furnitureId);
    public void saveAll(Long roomId);
    public void loadAll(Long roomId);
    public List<RoomFurniture> fetchAll(Long roomId);
    public void store(Long roomId, RoomFurniture roomFurniture);
}
