package com.example.gagunokuga_back.article.dto;

import com.example.gagunokuga_back.article.domain.ArticleImage;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class ArticleImageResponse {
    private Long id;
    private String imageUrl;

    // Entity → DTO 변환 메서드
    public static ArticleImageResponse fromEntity(ArticleImage articleImage) {
        return ArticleImageResponse.builder()
                .id(articleImage.getId())
                .imageUrl(articleImage.getImageUrl())
                .build();
    }
}
