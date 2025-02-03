package com.example.gagunokuga_back.user.dto;

import lombok.Getter;


@Getter
public class TokenDto {

    private String accessToken;
    private String refreshToken;

    public TokenDto(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public TokenDto(String accessToken) {
        this.accessToken = accessToken;
    }
}
