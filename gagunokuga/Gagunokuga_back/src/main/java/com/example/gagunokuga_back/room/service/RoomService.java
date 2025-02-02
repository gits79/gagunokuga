package com.example.gagunokuga_back.room.service;

import com.example.gagunokuga_back.room.dto.RoomListResponse;

public interface RoomService {
    public void createRoom(String roomName, String thumbnailUrl);
    public RoomListResponse roomList(int size, int lastId);
    public void updateRoomName(String roomId, String roomName);
    public void deleteRoom(String roomId);
}
