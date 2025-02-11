package com.example.gagunokuga_back.user.service;

import com.example.gagunokuga_back.user.dto.login.LoginRequestDto;
import com.example.gagunokuga_back.user.dto.login.TokenResponseDto;
import com.example.gagunokuga_back.user.repository.UserRepository;
import com.example.gagunokuga_back.user.security.CustomUserDetails;
import com.example.gagunokuga_back.user.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

//      기존 방식임
//    public TokenResponseDto login(LoginRequestDto loginDto) {
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                loginDto.getEmail(), loginDto.getPassword()));
//
//        User user = userRepository.findByEmail(loginDto.getEmail());
//
//
//        return jwtTokenProvider.createToken(user.getId());
//    }
//

    public TokenResponseDto login(LoginRequestDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(), loginDto.getPassword()));

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return jwtTokenProvider.createToken(userDetails.getId());
    }
}
