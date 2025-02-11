package com.example.gagunokuga_back.user.controller;

import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.dto.user.PasswordRequestDto;
import com.example.gagunokuga_back.user.dto.PasswordResetRequestDto;
import com.example.gagunokuga_back.user.dto.user.UpdateRequestDto;
import com.example.gagunokuga_back.user.dto.login.UserResponseDto;
import com.example.gagunokuga_back.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //마이페이지 들어가기 전 비밀번호 입력해서 맞는지 확인
    @PostMapping("/pwd")
    public ResponseEntity<?> checkPassword(@RequestBody PasswordRequestDto passwordRequestDto) {
        System.out.println(passwordRequestDto.getPassword());
        userService.checkPassword(passwordRequestDto);
        return ResponseEntity.ok().build();
    }

    //내 정보 보기
    @GetMapping
    public ResponseEntity<UserResponseDto> getUser() {
        UserResponseDto userInfo = userService.getUserInfo();
        return ResponseEntity.ok().body(userInfo);
    }

    //내 정보 수정(닉넴, 비번)
    @PutMapping
    public ResponseEntity<UserResponseDto> updateUser(@RequestBody UpdateRequestDto updateRequestDto) {
        User updatedUser = userService.updateBasicInfo(updateRequestDto);
        return ResponseEntity.ok(UserResponseDto.builder()
                .email(updatedUser.getEmail())
                .nickname(updatedUser.getNickname())
                .profileImageUrl(updatedUser.getProfileImageUrl()).build());
    }

    //프로필 이미지 수정 - null일때 될지 몰라요
    @PutMapping("/profile-image")
    public ResponseEntity<UserResponseDto> updateUserProfileImage(@RequestPart("profileImage") MultipartFile profileImage) {
        User updatedUser = userService.updateProfileImage(profileImage);
        return ResponseEntity.ok(UserResponseDto.builder()
                .email(updatedUser.getEmail())
                .nickname(updatedUser.getNickname())
                .profileImageUrl(updatedUser.getProfileImageUrl()).build());

    }


    //비밀번호 재설정 (잃어버렸을때) -- 현재는 임시비번 유효시간 설정 안해놓음, boolean 체킹으로 백엔드에서 무조건 수정해야지만 페이지 사용할 수 있게 처리할지,,
    @PostMapping("/pwd/reset")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequestDto passwordResetDto) {
        userService.reset(passwordResetDto);
        return ResponseEntity.ok("Email sent");
    }

    //탈퇴
    @DeleteMapping
    public ResponseEntity<Void> deleteUser() {
        userService.delete();
        return ResponseEntity.ok().build();
    }
}
