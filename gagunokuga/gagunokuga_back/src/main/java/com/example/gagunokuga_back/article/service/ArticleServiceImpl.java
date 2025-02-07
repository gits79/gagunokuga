package com.example.gagunokuga_back.article.service;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.dto.ArticleListResponse;
import com.example.gagunokuga_back.article.dto.ArticleResponse;
import com.example.gagunokuga_back.article.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;

    @Override
    public ArticleListResponse getArticleList(int page) {
        int size = 20; // 한 페이지에 20개씩
        Pageable pageable = PageRequest.of(page, size);

        Page<Article> articlePage = articleRepository.findAll(pageable);

        List<ArticleResponse> articles = new ArrayList<>();

        // 현재 페이지의 데이터만 가져옴
        for(Article article : articlePage.getContent()) {
            articles.add(ArticleResponse.fromEntity(article));
        }

        // totalPages : (현재) DB에 저장된 전체 데이터 개수 -> 나중에 필요시 수정!
        return ArticleListResponse.builder()
                .totalPages((long) articlePage.getTotalElements())
                .articles(articles)
                .build();
    }

    @Override
    public ArticleResponse getArticleById(Long articleId) {
        Optional<Article> article = articleRepository.findById(articleId);

        return article.map(ArticleResponse::fromEntity).orElse(null);
    }

    @Override
    public void deleteArticle(Long articleId) {
        articleRepository.deleteById(articleId);
    }
}
