package com.example.gagunokuga_back.user.dto;

import lombok.Getter;

@Getter
public class UserResponseDto {
    private String email;
    private String nickname;
    private String profileImageUrl;

    public UserResponseDto(String email, String nickname, String profileImageUrl) {
        this.email = email;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }
}
