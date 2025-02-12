package com.example.gagunokuga_back.user.dto.login;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDto {
    private String email;
    private String nickname;
    private String profileImageUrl;
    private String provider;

    public UserResponseDto(String email, String nickname, String profileImageUrl, String provider) {
        this.email = email;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.provider = provider;
    }
}
