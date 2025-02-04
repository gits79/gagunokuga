package com.example.gagunokuga_back.room.service;

import com.example.gagunokuga_back.room.dto.RoomListResponse;
import com.example.gagunokuga_back.room.dto.UpdateRoomNameRequest;

public interface RoomService {
    public void createRoom(String roomName, String thumbnailUrl);
    public RoomListResponse getRoomList(int page);
    public void updateRoomName(Long roomId, UpdateRoomNameRequest updateRoomNameRequest);
    public void deleteRoom(Long roomId);
}
