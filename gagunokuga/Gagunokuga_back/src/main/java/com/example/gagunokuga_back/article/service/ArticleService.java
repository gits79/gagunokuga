package com.example.gagunokuga_back.article.service;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.dto.ArticleListResponse;
import com.example.gagunokuga_back.article.dto.ArticleResponse;

import java.util.Optional;

public interface ArticleService {
    ArticleListResponse getArticleList(int page);

    ArticleResponse getArticleById(Long articleId);

    void deleteArticle(Long articleId);
}
