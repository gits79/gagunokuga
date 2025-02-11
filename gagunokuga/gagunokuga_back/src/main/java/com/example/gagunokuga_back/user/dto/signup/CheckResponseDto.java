package com.example.gagunokuga_back.user.dto.signup;

import lombok.Getter;

@Getter
public class CheckResponseDto {
    private boolean isExisting;

    public CheckResponseDto(boolean isExisting) {
        this.isExisting = isExisting;
    }
}
