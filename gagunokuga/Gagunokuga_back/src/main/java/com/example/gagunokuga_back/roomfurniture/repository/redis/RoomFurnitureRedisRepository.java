package com.example.gagunokuga_back.roomfurniture.repository.redis;

import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import org.springframework.data.repository.CrudRepository;

public interface RoomFurnitureRedisRepository extends CrudRepository<RoomFurniture, Long> {
}
