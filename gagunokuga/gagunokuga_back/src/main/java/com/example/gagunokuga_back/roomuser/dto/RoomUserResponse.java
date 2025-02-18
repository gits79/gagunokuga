package com.example.gagunokuga_back.roomuser.dto;

import com.example.gagunokuga_back.roomuser.domain.RoomUser;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class RoomUserResponse {
    private String nickname;
    private Boolean isHost;
    private String profileImageUrl;

    public static RoomUserResponse fromEntity(RoomUser roomUser) {
        return RoomUserResponse.builder()
                .nickname(roomUser.getUser().getNickname())
                .isHost(roomUser.getIsHost())
                .profileImageUrl(roomUser.getUser().getProfileImageUrl()).build();
    }
}
