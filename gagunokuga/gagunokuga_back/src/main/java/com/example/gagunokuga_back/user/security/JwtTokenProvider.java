package com.example.gagunokuga_back.user.security;

import com.example.gagunokuga_back.user.dto.login.TokenResponseDto;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

//jwt 생성, 유효성 검사하는 클래스
@Component
public class JwtTokenProvider {


    private final Key key;

    private final long accessTokenValidity = 3600000; //1시간
    private final long refreshTokenValidity = 8640000; //1일

    public JwtTokenProvider(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    //토큰 생성
   public String generateToken(Long id, long validityInSeconds) {
        return Jwts.builder()
                .setSubject(String.valueOf(id))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + validityInSeconds))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
   }

    //생성된거 tokenDto로 반환
    public TokenResponseDto createToken(Long id) {

        return new TokenResponseDto(
                generateToken(id, accessTokenValidity), generateToken(id,refreshTokenValidity)
        );
    }

    //토큰으로 사용자 확인
    public Long getUserIdFromToken(String token) {
        try {

            String id = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            return Long.parseLong(id);
        }catch (Exception e){
            throw new JwtException("Invalid JWT token");
        }

    }

    //토큰 유ㅎ성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


}
