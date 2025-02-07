package com.example.gagunokuga_back.article.dto;

import com.example.gagunokuga_back.article.domain.Article;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class ArticleListResponse {
    private Long totalPages;
    private List<ArticleResponse> articles;
}
