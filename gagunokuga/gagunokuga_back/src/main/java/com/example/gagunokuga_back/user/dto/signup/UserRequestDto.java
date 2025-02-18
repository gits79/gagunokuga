package com.example.gagunokuga_back.user.dto.signup;

import lombok.Getter;

@Getter
public class UserRequestDto {


    private String email;
    private String password;
    private String nickname;
    private String authcode;
    private String profileImageUrl;

}
