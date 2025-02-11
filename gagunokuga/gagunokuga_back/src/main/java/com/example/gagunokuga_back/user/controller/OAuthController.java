package com.example.gagunokuga_back.user.controller;

import com.example.gagunokuga_back.user.dto.login.TokenResponseDto;
import com.example.gagunokuga_back.user.oauth.KakaoOauthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/oauth/login")
public class OAuthController {

    private final KakaoOauthService oauthService;
    @Value("${DOMAIN}")
    private String domain;

    @GetMapping("/kakao")
    public ResponseEntity<String> startkakao() {
        String kakaoAuthUrl = oauthService.getKakaoAuthUrl();
        return ResponseEntity.ok(kakaoAuthUrl);
    }


    //카카오 인증 후 콜백
    @GetMapping("/kakao/callback")
    public ResponseEntity<?> kakaoLogin(@RequestParam String code) {
        try {
            TokenResponseDto tokenResponseDto = oauthService.kakaoLogin(code);

//            HttpHeaders headers = new HttpHeaders();
//            headers.add("Authorization", "Bearer " + tokenResponseDto.getAccessToken());
//            headers.add("Refresh-Token", tokenResponseDto.getRefreshToken());
//            headers.add("Access-Control-Expose-Headers", "Authorization, Refresh-Token");
//            // 본문에는 성공 메시지만 반환
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .body("로그인에 성공했습니다.");

            // URL 구조 수정: #/oauth/success 뒤에 쿼리 파라미터가 오도록 변경
            String redirectUrl = UriComponentsBuilder
                    .fromUriString("http://" + domain + "/oauth/success") // 기본 URL
                    .build()
                    .toUriString()
                    + "?accessToken=" + tokenResponseDto.getAccessToken()   // 해시 뒤에 쿼리 파라미터 추가
                    + "&refreshToken=" + tokenResponseDto.getRefreshToken();


            System.out.println("Redirect URL: " + redirectUrl); // URL 로깅 추가

            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create(redirectUrl));

            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("인증 처리 중 오류가 발생했습니다:" + e.getMessage());
        }
    }

}
