package com.example.gagunokuga_back.roomuser.controller;

import com.example.gagunokuga_back.roomuser.dto.InviteGuestRequest;
import com.example.gagunokuga_back.roomuser.dto.KickGuestRequest;
import com.example.gagunokuga_back.roomuser.dto.RoomUserListResponse;
import com.example.gagunokuga_back.roomuser.service.RoomUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms/{roomId}/users")
@RequiredArgsConstructor
public class RoomUserController {
    private final RoomUserService roomUserService;

    @PostMapping
    public ResponseEntity<Void> inviteGuest(
            @PathVariable("roomId") Long roomId,
            @RequestBody InviteGuestRequest inviteGuestRequest) {
        roomUserService.inviteGuest(roomId, inviteGuestRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> kickGuest(
            @PathVariable("roomId") Long roomId,
            @RequestBody KickGuestRequest kickGuestRequest) {
        roomUserService.kickGuest(roomId, kickGuestRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<RoomUserListResponse> listRoomUsers(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomUserService.listRoomUsers(roomId));
    }
}
