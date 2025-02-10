package com.example.gagunokuga_back.user.controller;

import com.example.gagunokuga_back.user.dto.LoginRequestDto;
import com.example.gagunokuga_back.user.dto.TokenResponseDto;
import com.example.gagunokuga_back.user.exception.UserNotFoundException;
import com.example.gagunokuga_back.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class AuthController {

    private final AuthService authService;


    //login
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody LoginRequestDto loginDto) {
        try {
            TokenResponseDto token = authService.login(loginDto);
            return ResponseEntity.ok(token);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new TokenResponseDto(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //logout - 프론트 클라에서 처리 ,,
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
       return ResponseEntity.ok("Successfully logged out");
    }
}
