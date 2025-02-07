package com.example.gagunokuga_back.article.controller;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.dto.ArticleListResponse;
import com.example.gagunokuga_back.article.dto.ArticleResponse;
import com.example.gagunokuga_back.article.dto.CreateArticleRequest;
import com.example.gagunokuga_back.article.service.ArticleService;
import com.example.gagunokuga_back.image.service.ImageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ArticleResponse> createArticle(@RequestPart("articleData") String articleData, @RequestPart("images") List<MultipartFile> images) {

        ObjectMapper objectMapper = new ObjectMapper();
        CreateArticleRequest request;

        try{
            // String -> Json으로 dto 맵핑
            request = objectMapper.readValue(articleData, CreateArticleRequest.class);
        } catch (Exception e) {
            // dto 맵핑할 수 없을 때
            return ResponseEntity.badRequest().build();
        }

        ArticleResponse createdArticle;
        try {
            createdArticle = articleService.createArticle(request, images);
        } catch (IOException e) {
            // db에 등록할 수 없을 때
            return ResponseEntity.unprocessableEntity().build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);
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
