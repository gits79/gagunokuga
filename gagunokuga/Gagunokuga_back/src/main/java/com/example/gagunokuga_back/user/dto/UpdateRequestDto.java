package com.example.gagunokuga_back.user.dto;

import lombok.Getter;

@Getter
public class UpdateRequestDto {
    private String nickname;
    private String password;
    private String profileImageUrl;


}
