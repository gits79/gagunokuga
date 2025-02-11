package com.example.gagunokuga_back.roomuser.service;

import com.example.gagunokuga_back.room.domain.Room;
import com.example.gagunokuga_back.room.repository.RoomRepository;
import com.example.gagunokuga_back.roomuser.domain.RoomUser;
import com.example.gagunokuga_back.roomuser.dto.InviteGuestRequest;
import com.example.gagunokuga_back.roomuser.dto.KickGuestRequest;
import com.example.gagunokuga_back.roomuser.dto.RoomUserListResponse;
import com.example.gagunokuga_back.roomuser.dto.RoomUserResponse;
import com.example.gagunokuga_back.roomuser.repository.RoomUserRepository;
import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.repository.UserRepository;
import com.example.gagunokuga_back.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomUserServiceImpl implements RoomUserService {
    private final RoomUserRepository roomUserRepository;
    private final UserService userService;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Override
    public void assignHost(Room room, User user) {
        RoomUser roomUser = RoomUser.builder()
                .room(room)
                .user(user)
                .isHost(true).build();
        roomUserRepository.save(roomUser);
    }

    @Override
    public void inviteGuest(Long roomId, InviteGuestRequest request) {
        Room room = roomRepository.findById(roomId).orElseThrow();
        User currentUser = userService.getCurrentUser();
        User guest = userRepository.findByNickname(request.getNickname()).orElseThrow();

        RoomUser roomUser = roomUserRepository.findByRoomAndUser(room, currentUser);
        if (roomUser == null || !roomUser.getIsHost())
            return; // 초대 권한 없음
        if (roomUserRepository.existsByRoomAndUser(room, guest))
            return; // 이미 초대됨

        RoomUser newGuest = RoomUser.builder()
                .room(room)
                .user(guest)
                .isHost(false).build();
        roomUserRepository.save(newGuest);
    }

    @Override
    public void kickGuest(Long roomId, KickGuestRequest request) {
        Room room = roomRepository.findById(roomId).orElseThrow();
        User currentUser = userService.getCurrentUser();
        User guest = userRepository.findByNickname(request.getNickname()).orElseThrow();

        RoomUser roomUser = roomUserRepository.findByRoomAndUser(room, currentUser);
        if (roomUser == null || !roomUser.getIsHost())
            return; // 내보내기 권한 없음

        RoomUser kickedUser = roomUserRepository.findByRoomAndUser(room, guest);
        if (kickedUser != null) {
            roomUserRepository.delete(kickedUser);
        }
    }

    @Override
    public RoomUserListResponse listRoomUsers(Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow();
        List<RoomUser> roomUsers = roomUserRepository.findAllByRoom(room);
        List<RoomUserResponse> users = new ArrayList<>();
        for (RoomUser roomUser : roomUsers) {
            users.add(RoomUserResponse.fromEntity(roomUser));
        }
        return RoomUserListResponse.builder()
                .totalCount(users.size())
                .users(users).build();
    }

    @Override
    public void deleteRoomUsers(Room room) {
        roomUserRepository.deleteAllByRoom(room);
    }

    @Override
    public List<Room> selectAllByUser(User user) {
        return roomUserRepository.selectAllByUser(user);
    }

    @Override
    public List<Room> getOwnedRooms() {
        User user = userService.getCurrentUser();
        return roomUserRepository.selectAllByUserAndIsHostIsTrue(user);
    }

    @Override
    public List<Room> getJoinedRooms() {
        User user = userService.getCurrentUser();
        return roomUserRepository.selectAllByUserAndIsHostIsFalse(user);
    }
}
