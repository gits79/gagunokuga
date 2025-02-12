package com.example.gagunokuga_back.user.service;

import com.example.gagunokuga_back.image.service.ImageService;
import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.dto.*;
import com.example.gagunokuga_back.user.dto.login.UserResponseDto;
import com.example.gagunokuga_back.user.dto.signup.CheckResponseDto;
import com.example.gagunokuga_back.user.dto.signup.UserRequestDto;
import com.example.gagunokuga_back.user.dto.user.PasswordRequestDto;
import com.example.gagunokuga_back.user.dto.user.UpdateRequestDto;
import com.example.gagunokuga_back.user.email.EmailService;
import com.example.gagunokuga_back.user.repository.UserRepository;
import com.example.gagunokuga_back.user.security.CustomUserDetails;
import io.jsonwebtoken.io.EncodingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.ott.InvalidOneTimeTokenException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.InputMismatchException;
import java.util.NoSuchElementException;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ImageService imageService;


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
                User user = new User(
                requestDto.getEmail(),
                encodedPassword,
                requestDto.getNickname()
        );

        user.changeProfileImgUrl(requestDto.getProfileImageUrl());
        userRepository.save(user);
    }

    //비번 체크
    @Transactional
    public void checkPassword(PasswordRequestDto passwordRequestDto) {
        User user = getCurrentUser();
        if(!passwordEncoder.matches(passwordRequestDto.getPassword(), user.getPassword())) {
            throw new InputMismatchException("Wrong password");
        }

    }

    //내 정보 조회
    @Transactional
    public UserResponseDto getUserInfo() {
        User user = getCurrentUser();
        return new UserResponseDto(user.getEmail(), user.getNickname(), user.getProfileImageUrl(), user.getProvider());
    }

    //정보(닉넴, 비번) 수정
    @Transactional
    public User updateBasicInfo(UpdateRequestDto request) {
        User user = getCurrentUser();
        if(request.getNickname()!=null && !request.getNickname().isBlank()) {
            if(userRepository.existsByNickname(request.getNickname())) {
                throw new InputMismatchException("Nickname already exists");
            }
            user.changeNickname(request.getNickname());
        }
        if(request.getPassword()!=null && !request.getPassword().isBlank()) {
            user.changePassword(passwordEncoder.encode(request.getPassword()));
        }
//        if(request.getProfileImageUrl()!=null) {
//            user.changeProfileImgUrl(request.getProfileImageUrl());
//        }

        return userRepository.save(user);

    }

    //이미지 수정
    @Transactional
    public User updateProfileImage(MultipartFile profileImage) {
        User user = getCurrentUser();
        if(user == null) {
            throw new NoSuchElementException("User not found");
        }

        try {
            if(user.getProfileImageUrl() != null) {
                imageService.deleteImage(user.getProfileImageUrl());
            }
            String newImageUrl = imageService.uploadImage(profileImage);
            user.changeProfileImgUrl(newImageUrl);
            return userRepository.save(user);

        } catch (IOException e) {
            throw new RuntimeException("Failed to process image file",e);
        }

    }

    //삭제
    @Transactional
    public void delete() {
        User user = getCurrentUser();
        userRepository.delete(user);
    }

    //잃어버린 비번 재설정
    @Transactional
    public void reset(PasswordResetRequestDto passwordResetDto) {
        String email = passwordResetDto.getEmail();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new NoSuchElementException("User not found");
        }
        try {
            String tempPassword = UUID.randomUUID().toString().substring(0, 10);
            emailService.sendTempPwd(email, tempPassword);
            user.changePassword(passwordEncoder.encode(tempPassword));
            userRepository.save(user);
        } catch (Exception e) {
            throw new InputMismatchException("Wrong password");
        }
    }

    //토큰으로 유저 확인
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new InvalidOneTimeTokenException("no token information");
        }
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(customUserDetails.getUsername());
        if (user == null) {
            throw new NoSuchElementException("no such user");
        }
        return user;
    }

    @Transactional
    public User saveOrUpdate(User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if(existingUser != null) {
            // 기존 유저가 카카오 유저인 경우 업데이트
            if("kakao".equals(existingUser.getProvider())) {
                existingUser.changeNickname(user.getNickname());
                existingUser.changeProfileImgUrl(user.getProfileImageUrl());
                return userRepository.save(existingUser);
            }
            // 일반 회원가입 유저인 경우 예외 발생
            throw new IllegalArgumentException("User already exists with this email");
        }
        return userRepository.save(user);
    }



}
