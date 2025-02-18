package com.example.gagunokuga_back.user.security;

import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.dto.login.TokenResponseDto;
import com.example.gagunokuga_back.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;


    @Value("${app.oauth2.authorized-redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {


        response.reset();

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(customUserDetails.getUsername());

        //토큰 생성
        TokenResponseDto tokenResponseDto = jwtTokenProvider.createToken(user.getId());

        // 프론트엔드 리다이렉트 URI에 토큰을 쿼리 파라미터로 추가
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("accessToken", tokenResponseDto.getAccessToken())
                .queryParam("refreshToken", tokenResponseDto.getRefreshToken())
                .build().toUriString();

        // 응답 컨텐츠 타입 설정 제거
        response.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
        response.setHeader("Pragma", "no-cache");

        // 부모 클래스의 리다이렉트 메소드를 사용
        super.setAlwaysUseDefaultTargetUrl(false);
        super.onAuthenticationSuccess(request, response, authentication);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);

    }
}
