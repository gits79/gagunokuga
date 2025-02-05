package com.example.gagunokuga_back.article.controller;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.dto.ArticleListResponse;
import com.example.gagunokuga_back.article.dto.ArticleResponse;
import com.example.gagunokuga_back.article.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final ArticleService articleService;

    // 전체 게시글 조회
    @GetMapping
    public ResponseEntity<ArticleListResponse> getArticleList(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(articleService.getArticleList(page));
    }

    // 게시글 등록 -------------------------> 구현해야됨!!!!!!!!!!
    @PostMapping
    public ResponseEntity<ArticleResponse> createArticle(@RequestBody Article article) {
        return null;
    }

    // 특정 게시글 조회
    @GetMapping("/{articleId}")
    public ResponseEntity<ArticleResponse> getArticleById(@PathVariable("articleId") Long articleId) {

        ArticleResponse articleResponse = articleService.getArticleById(articleId);

        if (articleResponse == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(articleResponse);
    }

    // 게시글 수정
    @PutMapping("/{articleId}")
    public ResponseEntity<ArticleResponse> updateArticle(@PathVariable("articleId") Long articleId, @RequestBody Article article) {
        return null;
    }

    // 게시글 삭제
    @DeleteMapping("/{articleId}")
    public ResponseEntity<Void> deleteArticle(@PathVariable("articleId") Long articleId) {
        articleService.deleteArticle(articleId);
        return ResponseEntity.noContent().build();
    }
}
