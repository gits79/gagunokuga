package com.example.gagunokuga_back.user.domain;

import com.example.gagunokuga_back.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "users")
public class User extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false)
    private int isAdmin =0; //0 : 일반 사용자 1: 관리자권한


    private String provider;/*socialtype*/

    private String providerId; /*socialid*/


    private String profileImageUrl;


    public User(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.isAdmin = 0; //기본 값
    }

    public User(String email, String nickname, String provider, String providerId, String profileImageUrl, int isAdmin) {
        this.email = email;
        this.nickname = nickname;
        this.provider = provider;
        this.providerId = providerId;
        this.profileImageUrl = profileImageUrl;
        this.isAdmin = isAdmin;
    }

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changePassword(String password) {
        this.password = password;
    }

    public void changeProfileImgUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public List<GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(isAdmin ==1 ? "ROLE_ADMIN" : "ROLE_USER"));
    }

//    public void grantAdmin() {
//        this.isAdmin = 1;
//    }
}
