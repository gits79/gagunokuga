package com.example.gagunokuga_back.user.controller;

import com.example.gagunokuga_back.user.dto.user.SearchResultDto;
import com.example.gagunokuga_back.user.service.InviteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/list")
public class InviteController {

    private final InviteService inviteService;

    //닉네임으로 검색한 결과
    @GetMapping
    public ResponseEntity<SearchResultDto> getUsers(@RequestParam String keyword) {
         SearchResultDto result = inviteService.search(keyword);
         return ResponseEntity.ok(result);
    }

//    //방에 초대하기 - ("/api/room/{roomId}/invite) //방 연결한 후에 가능
//    @PostMapping("{roomId}/invite")
//    public ResponseEntity<Void> inviteUsers(@PathVariable Long roomId, @RequestBody SearchResponseDto searchResponseDto) {
//
//        inviteService.inviteUser(roomId, searchResponseDto);
//
//        return ResponseEntity.ok().build();
//
//    }
}
