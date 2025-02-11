package com.example.gagunokuga_back.user.oauth;

import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.dto.login.TokenResponseDto;
import com.example.gagunokuga_back.user.repository.UserRepository;
import com.example.gagunokuga_back.user.security.CustomUserDetails;
import com.example.gagunokuga_back.user.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;


//    @Override
//    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//        OAuth2User oAuth2User = super.loadUser(userRequest);
//
//        Map<String, Object> attributes = oAuth2User.getAttributes();
//        String email = (String) attributes.get("account_email");
//        String nickname = (String) attributes.get("profile_nickname");
//        String profileImageUrl = (String) attributes.get("profile_image");
//
//        User user = userRepository.findByEmail(email);
//        if(user == null) {
//            user = new User(email, nickname, profileImageUrl);
//            userRepository.save(user);
//        }
//        CustomUserDetails customUserDetails = new CustomUserDetails(user, attributes);
//        TokenResponseDto tokenResponse = jwtTokenProvider.createToken(user.getId());
//        String token = tokenResponse.getAccessToken();
//
//        return customUserDetails;
//
//    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 카카오에서 받아온 데이터 구조 확인을 위한 로깅
        log.info("OAuth2User attributes: {}", oAuth2User.getAttributes());

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");
        String profileImageUrl = (String) profile.get("profile_image_url");

        // null 체크
        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User(
                    email,
                    nickname,
                    "kakao",  // provider
                    String.valueOf(attributes.get("id")),  // providerId
                    profileImageUrl,
                    0  // isAdmin
            );
            userRepository.save(user);
        }

        CustomUserDetails customUserDetails = new CustomUserDetails(user, attributes);
        TokenResponseDto tokenResponse = jwtTokenProvider.createToken(user.getId());
        String token = tokenResponse.getAccessToken();

        return customUserDetails;
    }
}
