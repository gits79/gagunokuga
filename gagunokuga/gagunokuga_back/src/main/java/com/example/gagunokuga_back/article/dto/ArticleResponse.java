package com.example.gagunokuga_back.article.dto;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.domain.ArticleImage;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
@ToString
public class ArticleResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private String nickName;
    private String profileImageUrl;
    private List<String> articleImageUrls; // 이미지 URL 리스트

    // Entity → DTO 변환 메서드
    public static ArticleResponse fromEntity(Article article) {
        return ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .createdAt(article.getCreatedAt())
                .nickName(article.getUser().getNickname()) // User 엔티티에서 닉네임 가져오기
                .profileImageUrl(article.getUser().getProfileImageUrl()) // 프로필 이미지 URL
                .articleImageUrls(article.getArticleImages().stream()
                        .map(ArticleImage::getImageUrl) // ArticleImage 엔티티에서 URL만 가져오기
                        .collect(Collectors.toList()))
                .build();
    }
}
