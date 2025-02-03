package com.example.gagunokuga_back.user.service;

import com.example.gagunokuga_back.user.dto.LoginRequestDto;
import com.example.gagunokuga_back.user.dto.TokenResponseDto;
import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.repository.UserRepository;
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


    public TokenResponseDto login(LoginRequestDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(), loginDto.getPassword()));

        User user = userRepository.findByEmail(loginDto.getEmail());


        return jwtTokenProvider.createToken(user.getId());
    }
}
