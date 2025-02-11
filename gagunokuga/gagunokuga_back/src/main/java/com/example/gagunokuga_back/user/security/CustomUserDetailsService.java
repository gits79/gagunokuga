package com.example.gagunokuga_back.user.security;

import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);

        if(user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다");
        }
        return new CustomUserDetails(user);
    }

    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        return new CustomUserDetails(user);
    }

    // OAuth2 로그인 -이메일로 하는거
    public UserDetails loadUserByOAuth2User(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        User user = userRepository.findByEmail(email);
        if(user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new CustomUserDetails(user, oauth2User.getAttributes());
    }
//
//    // OAuth2 로그인 -  아이디로 하는거  - 얘는 다시 그럼 컬럼 추가해야함 kakaoId이런느낌으로
//    public UserDetails loadUserByOAuth2User(OAuth2User oauth2User) {
//        Long userId = oauth2User.getAttribute("id");
//        if(userId == null) {
//            throw new UsernameNotFoundException("User not found with email: " + email);
//        }
//
//        User user = userRepository.findBy
//
//        return new CustomUserDetails(user, oauth2User.getAttributes());
//    }


}
