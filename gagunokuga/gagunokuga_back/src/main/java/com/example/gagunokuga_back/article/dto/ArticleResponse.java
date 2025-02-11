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
    private String nickname;
    private String profileImageUrl;
    private List<ArticleImageResponse> articleImages; // 이미지 URL 리스트

    // Entity → DTO 변환 메서드
    public static ArticleResponse fromEntity(Article article) {
        // 이미지 리스트 변환
        List<ArticleImageResponse> articleImageResponses = article.getArticleImages().stream()
                .map(ArticleImageResponse::fromEntity) // ArticleImage -> ArticleImageResponse 변환
                .toList();

        return ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .createdAt(article.getCreatedAt())
                .nickname(article.getUser().getNickname()) // User 엔티티에서 닉네임 가져오기
                .profileImageUrl(article.getUser().getProfileImageUrl()) // 프로필 이미지 URL
                .articleImages(articleImageResponses) // 변환된 이미지 리스트
                .build();
    }
}
