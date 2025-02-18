package com.example.gagunokuga_back.roomuser.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class RoomUserListResponse {
    private Integer totalCount;
    private List<RoomUserResponse> users;
}
