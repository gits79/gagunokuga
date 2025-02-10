package com.example.gagunokuga_back.user.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//사용자 인증 필터
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
//        String token = resolveToken(request);
//
//        if(token != null ) {
//            Long id = jwtTokenProvider.getUserIdFromToken(token);
//            CustomUserDetails customUserDetails = (CustomUserDetails) customUserDetailsService.loadUserById(id);
//
//            if(customUserDetails != null) {
//                JwtAuthenticationToken authenticationToken =new JwtAuthenticationToken(
//                        customUserDetails, token, customUserDetails.getAuthorities());
//                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                SecurityContextHolder.getContext().setAuthentication(authenticationToken); //인증정보 설정
//
//
//            }
//
//        }
        try {
            String token = resolveToken(request);
            if (token != null && jwtTokenProvider.validateToken(token)) { // 유효한 토큰인지 확인
                Long id = jwtTokenProvider.getUserIdFromToken(token);
                if (id != null) {
                    CustomUserDetails customUserDetails = (CustomUserDetails) customUserDetailsService.loadUserById(id);
                    if (customUserDetails != null) {
                        JwtAuthenticationToken authenticationToken = new JwtAuthenticationToken(
                                customUserDetails, token, customUserDetails.getAuthorities());
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("JWT 필터 처리 중 오류 발생: {}");
        }
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if(bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); //Bearer 이후 토큰 반환
        }
        return null;
    }
}
