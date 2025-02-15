package com.example.gagunokuga_back.roomfurniture.mapper;

import com.example.gagunokuga_back.furniture.domain.Furniture;
import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.roomfurniture.domain.RoomFurniture;
import com.example.gagunokuga_back.roomfurniture.dto.RoomFurnitureDto;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_NULL
)
public interface RoomFurnitureMapper {
    RoomFurnitureMapper INSTANCE = Mappers.getMapper(RoomFurnitureMapper.class);

    @Mapping(source = "roomFurnitureDto.id", target = "id")
    @Mapping(source = "roomFurnitureDto.width", target = "width")
    @Mapping(source = "roomFurnitureDto.height", target = "height")
    @Mapping(source = "room", target = "room")
    @Mapping(source = "furniture", target = "furniture")
    RoomFurniture toRoomFurniture(RoomFurnitureDto roomFurnitureDto, Room room, Furniture furniture);

    @Mapping(source = "roomFurniture.furniture.id", target = "furnitureId")
    @Mapping(source = "roomFurniture.furniture.furnitureName", target = "furnitureName")
    @Mapping(source = "roomFurniture.furniture.imageUrl", target = "imageUrl")
    @Mapping(source = "roomFurniture.room.id", target = "roomId")
    @Mapping(target = "isDeleted", expression = "java(false)")
    RoomFurnitureDto toRoomFurnitureDto(RoomFurniture roomFurniture, Long index);
}
