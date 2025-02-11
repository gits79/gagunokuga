package com.example.gagunokuga_back.user.oauth;

import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.dto.kakao.KakaoTokenDto;
import com.example.gagunokuga_back.user.dto.login.TokenResponseDto;
import com.example.gagunokuga_back.user.repository.UserRepository;
import com.example.gagunokuga_back.user.security.JwtTokenProvider;
import com.example.gagunokuga_back.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoOauthService {

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    private final OAuth2ClientProperties properties;
//    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
//    private final RestTemplate restTemplate;
    private final UserService userService;
    private final WebClient webClient;
    private final UserRepository userRepository;



    //카카오 로그인 했을때(param으로 제공 코드)
    public TokenResponseDto kakaoLogin(String code) {
        //카카오에서 엑세스 토큰 가져옴
        KakaoTokenDto kakaoToken = getKakaoAccesstoken(code);
        //엑세스 토큰으로 사용자 정보 가져옴
        User user = getkakaoUserInfo(kakaoToken.getAccessToken());

        //사용자 없으면 새로 저장.
        user = userService.saveOrUpdate(user);
        
        //토큰 생성하여 반환
        return jwtTokenProvider.createToken(user.getId());
    }



    //카카오 엑세스 토큰 가져오는 메서드
    private KakaoTokenDto getKakaoAccesstoken(String code) {
//        String tokenUrl = properties.getProvider().get("kakao").getTokenUri();
//        String url = String.format(tokenUrl, code);
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Content-Type", "application/x-www-form-urlencoded");
//
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<KakaoTokenDto> response = restTemplate.exchange(url, HttpMethod.GET, entity, KakaoTokenDto.class);
//
//        return response.getBody();
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("code", code);
        formData.add("redirect_uri", redirectUri);

        return webClient.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        response -> Mono.error(new OAuth2AuthenticationException("카카오 토큰 발급 실패")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        response -> Mono.error(new OAuth2AuthenticationException("카카오 서버 오류")))
                .bodyToMono(KakaoTokenDto.class)
                .block();
    }

    //카카오 사용자 정보 가져오는 메ㅐ서드
    private User getkakaoUserInfo(String accessToken) {
//        String userInfoUrl = properties.getProvider().get("kakao").getUserInfoUri();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + accessToken);
//
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
//        Map<String, Object> userInfo = response.getBody();
//
//        String email = (String) userInfo.get("account_email");
//        String nickname = (String) userInfo.get("profile_nickname");
//        String profileImage = (String) userInfo.get("profile_image");
//
//        User user =  userRepository.findByEmail(email);
//        if(user ==null) {
//            user = new User(email, nickname, profileImage);
//
//        }
//        return user;
        Map<String, Object> response = webClient.get()
                .uri("https://kapi.kakao.com/v2/user/me")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        clientResponse -> Mono.error(new OAuth2AuthenticationException("카카오 사용자 정보 조회 실패")))
                .onStatus(HttpStatusCode::is5xxServerError,
                        clientResponse -> Mono.error(new OAuth2AuthenticationException("카카오 서버 오류")))
                .bodyToMono(Map.class)
                .block();

        Map<String, Object> kakaoAccount = (Map<String, Object>) response.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");
        String profileImage = (String) profile.get("profile_image_url");
        String providerId = String.valueOf(response.get("id"));

        return new User(email, nickname, "kakao", providerId, profileImage, 0);

    }

    public String getKakaoAuthUrl() {
        return UriComponentsBuilder.fromHttpUrl("https://kauth.kakao.com/oauth/authorize")
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("scope", "account_email profile_nickname profile_image")
                .build()
                .toUriString();
    }

//    private User getkakaoUserInfo(String accessToken) {
//        String userInfoUrl = properties.getProvider().get("kakao").getUserInfoUri();
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + accessToken);
//
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
//
//        Map<String, Object> userInfo = response.getBody();
//        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
//        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
//
//        Long kakaoId = Long.valueOf(String.valueOf(userInfo.get("id")));
//        String email = (String) kakaoAccount.get("email");
//        String nickname = (String) profile.get("nickname");
//        String profileImage = (String) profile.get("profile_image_url");
//
//        User user = userRepository.findByKakaoId(kakaoId);
//        if(user == null) {
//            user = new User(kakaoId, email, nickname, profileImage);
//        }
//        return user;
//    }
}
