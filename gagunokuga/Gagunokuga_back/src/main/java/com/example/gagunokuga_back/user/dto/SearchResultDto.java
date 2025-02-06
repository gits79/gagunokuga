package com.example.gagunokuga_back.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class SearchResultDto {

    private int totalCount;
    private List<SearchResponseDto> users;

}
