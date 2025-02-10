package com.example.gagunokuga_back.user.controller;

import com.example.gagunokuga_back.user.dto.signup.CheckResponseDto;
import com.example.gagunokuga_back.user.dto.signup.UserRequestDto;
import com.example.gagunokuga_back.user.email.AuthCodeService;
import com.example.gagunokuga_back.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class SignUpController {

    private final UserService userService;
    private final AuthCodeService authCodeService;


    //이메일 중복 체크
    @GetMapping("/email")
    public ResponseEntity<CheckResponseDto> getUserByEmail(@RequestParam String email) {
        CheckResponseDto checkResponseDto = userService.checkEmail(email);
        return ResponseEntity.ok(checkResponseDto);
    }

    //닉네임 중복 체크
    @GetMapping("/nickname")
    public ResponseEntity<CheckResponseDto> getUserByNickname(@RequestParam String nickname) {
        CheckResponseDto checkResponseDto = userService.checkNickname(nickname);
        return ResponseEntity.ok(checkResponseDto);
    }


    //이메일 발송
    @PostMapping("/email")
    public ResponseEntity<String> sendEmail(@RequestBody UserRequestDto userRequestDto) {
        authCodeService.sendAuthCode(userRequestDto);
        return ResponseEntity.ok("Email sent");
    }

    //이메일 인증
    @PostMapping("/email/verify")
    public ResponseEntity<String> verifyEmail(@RequestBody UserRequestDto userRequestDto) {
        boolean isVerified = authCodeService.verifyAuthCode(userRequestDto);

        if(isVerified) {
            return ResponseEntity.ok("Email verified");
        }
        return ResponseEntity.ok("Email not verified");
    }


    //회원가입
    @PostMapping
    public ResponseEntity<String> signup(@RequestBody UserRequestDto requestDto) {

//        boolean isVerified = authCodeService.verifyAuthCode(requestDto.getEmail(), requestDto.getAuthcode());
//
//        if (!isVerified) {
//            return ResponseEntity.badRequest().body(null); // 인증 실패 시 가입 불가
//        }  //프론트에서 처리하면 됨.

        userService.signup(requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body("signup success");

    }



}

