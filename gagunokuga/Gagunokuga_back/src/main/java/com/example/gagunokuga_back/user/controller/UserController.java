package com.example.gagunokuga_back.user.controller;

import com.example.gagunokuga_back.user.dto.PasswordRequestDto;
import com.example.gagunokuga_back.user.dto.UpdateRequestDto;
import com.example.gagunokuga_back.user.dto.UserResponseDto;
import com.example.gagunokuga_back.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //마이페이지 들어가기 전 비밀번호 입력해서 맞는지 확인
    @PostMapping("/pwd")
    public ResponseEntity<?> checkPassword(@RequestBody PasswordRequestDto passwordRequestDto) {
        userService.checkPassword(passwordRequestDto);
        return ResponseEntity.ok().build();
    }

    //내 정보 보기
    @GetMapping
    public ResponseEntity<UserResponseDto> getUsers() {
        UserResponseDto userInfo = userService.getUserInfo();
        return ResponseEntity.ok().body(userInfo);
    }

    //내 정보 수정
    @PutMapping
    public ResponseEntity<Void> updateUser(@RequestBody UpdateRequestDto updateRequestDto) {
        userService.update(updateRequestDto);
        return ResponseEntity.ok().build();
    }

//    //비밀번호 재설정 (잃어버렸을때)
//    @PostMapping("/pwd/reset")
//    public ResponseEntity<Void> resetPassword(@RequestBody PasswordResetRequestDto passwordResetDto) {
//        userService.reset(passwordResetDto);
//        return ResponseEntity.ok().build();
//    }

    //탈퇴
    @DeleteMapping
    public ResponseEntity<Void> deleteUser() {
        userService.delete();
        return ResponseEntity.ok().build();
    }
}
