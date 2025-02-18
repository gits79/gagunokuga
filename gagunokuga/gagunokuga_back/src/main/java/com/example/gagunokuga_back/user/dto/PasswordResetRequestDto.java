package com.example.gagunokuga_back.user.dto;

import lombok.Getter;

@Getter
public class PasswordResetRequestDto {
    private String email;
    private String newPassword;
}

