package com.example.gagunokuga_back.user.security;

import com.example.gagunokuga_back.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CustomUserDetails implements UserDetails, OAuth2User {

    private final User user;
    private final Map<String, Object> attributes;
//

    public Long getId() {
        return user.getId();
    }

    public CustomUserDetails(User user) {
        this.user = user;
        this.attributes = null;
    }

    //OAuth
    public CustomUserDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }



    //OAuth 용
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getName() {
        return user.getEmail();
    }

//    @Override
//    public boolean isEnabled() {
//        return UserDetails.super.isEnabled();
//    }
}
