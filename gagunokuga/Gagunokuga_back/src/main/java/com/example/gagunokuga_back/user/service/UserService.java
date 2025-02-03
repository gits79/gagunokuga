package com.example.gagunokuga_back.user.service;

import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.dto.CheckResponseDto;
import com.example.gagunokuga_back.user.dto.UserRequestDto;
import com.example.gagunokuga_back.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    //이메일 중복 체크
    public CheckResponseDto checkEmail(String email) {
        return new CheckResponseDto(userRepository.existsByEmail(email));

    }

    //닉네임 중복 체크
    public CheckResponseDto checkNickname(String nickname) {
        return new CheckResponseDto(userRepository.existsByNickname(nickname));

    }


    //회원가입
    @Transactional
    public void signup(UserRequestDto requestDto) {
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());
        //String profileImg = api불러와서 해결하기
        User user = new User(
                requestDto.getEmail(),
                encodedPassword,
                requestDto.getNickname()
        );

        userRepository.save(user);
//         return new UserResponseDto(user.getEmail(), user.getNickname(), user.getProfileImageUrl());
    }

//    @Transactional
//    public void checkPassword(PasswordRequestDto password) {
//
//    }
}
