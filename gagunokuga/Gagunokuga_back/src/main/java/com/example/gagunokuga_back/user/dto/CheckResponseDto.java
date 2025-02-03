package com.example.gagunokuga_back.user.dto;

import lombok.Getter;

@Getter
public class CheckResponseDto {
    boolean isExisting;

    public CheckResponseDto(boolean isExisting) {
        this.isExisting = isExisting;
    }
}
