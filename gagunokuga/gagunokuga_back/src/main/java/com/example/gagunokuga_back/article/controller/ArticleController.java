package com.example.gagunokuga_back.article.controller;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.dto.ArticleListResponse;
import com.example.gagunokuga_back.article.dto.ArticleResponse;
import com.example.gagunokuga_back.article.dto.CreateArticleRequest;
import com.example.gagunokuga_back.article.service.ArticleService;
import com.example.gagunokuga_back.image.service.ImageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
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

    // 게시글 등록
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
    @PutMapping(path = "/{articleId}", consumes = {"multipart/form-data"})
    public ResponseEntity<ArticleResponse> updateArticle(@PathVariable("articleId") Long articleId, @RequestPart("articleData") String articleData, @RequestPart(value="images", required = false) List<MultipartFile> newImages, @RequestPart(value = "deleteList", required = false) String deleted) {

        ObjectMapper objectMapper = new ObjectMapper();
        CreateArticleRequest request;
        List<Long> deleteList = new ArrayList<Long>();

        try{
            // String -> Json으로 dto 맵핑
            request = objectMapper.readValue(articleData, CreateArticleRequest.class);

            // deleteList가 JSON 문자열이라면 파싱
            if (deleted != null && !deleted.isEmpty()) {
                deleteList = objectMapper.readValue(deleted, new TypeReference<List<Long>>() {});
            }

        } catch (Exception e) {
            // dto 맵핑할 수 없을 때
            return ResponseEntity.badRequest().build();
        }

        ArticleResponse updatedArticle;
        try{
            updatedArticle = articleService.updateArticle(articleId, request, newImages, deleteList);
        } catch (AccessDeniedException e) {
            return ResponseEntity.badRequest().build();
        }
        catch (Exception e) {
            // 수정할 수 없을 때
            return ResponseEntity.unprocessableEntity().build();
        }

        return ResponseEntity.ok(updatedArticle);
    }

    // 게시글 삭제
    @DeleteMapping("/{articleId}")
    public ResponseEntity<Void> deleteArticle(@PathVariable("articleId") Long articleId) {
        articleService.deleteArticle(articleId);
        return ResponseEntity.noContent().build();
    }
}
