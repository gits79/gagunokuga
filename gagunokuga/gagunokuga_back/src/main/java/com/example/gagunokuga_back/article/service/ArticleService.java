package com.example.gagunokuga_back.article.service;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.dto.ArticleListResponse;
import com.example.gagunokuga_back.article.dto.ArticleResponse;
import com.example.gagunokuga_back.article.dto.CreateArticleRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface ArticleService {
    ArticleResponse createArticle(CreateArticleRequest request, List<MultipartFile> images) throws IOException;

    ArticleListResponse getArticleList(int page);

    ArticleResponse getArticleById(Long articleId);

    void deleteArticle(Long articleId);

}
