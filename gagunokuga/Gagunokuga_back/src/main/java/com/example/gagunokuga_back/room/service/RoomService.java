package com.example.gagunokuga_back.room.service;

import com.example.gagunokuga_back.room.dto.RoomListResponse;

public interface RoomService {
    public void createRoom(String roomName, String thumbnailUrl);
    public RoomListResponse getRoomList(int page, int size);
    public void updateRoomName(Long roomId, String roomName);
    public void deleteRoom(Long roomId);
}
