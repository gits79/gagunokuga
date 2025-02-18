package com.example.gagunokuga_back.user.service;

import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.dto.user.SearchResponseDto;
import com.example.gagunokuga_back.user.dto.user.SearchResultDto;
import com.example.gagunokuga_back.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InviteService {

    private final UserRepository userRepository;
    private final UserService userService;

    public SearchResultDto search(String keyword) {
        List<User> users = userRepository.findByNicknameContaining(keyword);

        String currentUserNickname = userService.getCurrentUser().getNickname();


        List<SearchResponseDto> searchedUsers = users.stream()
                .filter(user -> !user.getNickname().equals(currentUserNickname)) //본인 닉네임도 검색될 수 있으니 제외
                .map(user -> new SearchResponseDto(user.getNickname(), user.getProfileImageUrl())).collect(Collectors.toList());

        int totalCount = searchedUsers.size();

        return new SearchResultDto(totalCount, searchedUsers);
    }


//
//    public void inviteUser(Long roomId, SearchResponseDto searchResponseDto) {
//
//
//    }
}
