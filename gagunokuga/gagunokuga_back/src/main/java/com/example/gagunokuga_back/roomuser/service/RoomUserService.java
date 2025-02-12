package com.example.gagunokuga_back.roomuser.service;

import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.roomuser.dto.InviteGuestRequest;
import com.example.gagunokuga_back.roomuser.dto.KickGuestRequest;
import com.example.gagunokuga_back.roomuser.dto.RoomUserListResponse;
import com.example.gagunokuga_back.user.domain.User;

import java.util.List;

public interface RoomUserService {
    public void assignHost(Room room, User user);
    public void inviteGuest(Long roomId, InviteGuestRequest inviteGuestRequest);
    public void kickGuest(Long roomId, KickGuestRequest kickGuestRequest);
    public RoomUserListResponse listRoomUsers(Long roomId);
    public void deleteRoomUsers(Room room);
    public List<Room> selectAllByUser(User user);
    public List<Room> getOwnedRooms();
    public List<Room> getJoinedRooms();
}
