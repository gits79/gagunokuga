package com.example.gagunokuga_back.comment.controller;

import com.example.gagunokuga_back.comment.dto.CommentListResponse;
import com.example.gagunokuga_back.comment.dto.CommentRequest;
import com.example.gagunokuga_back.comment.dto.CommentResponse;
import com.example.gagunokuga_back.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/articles")
public class CommentController {
    private final CommentService commentService;


    @GetMapping("/{articleId}/comments")
    public ResponseEntity<CommentListResponse> getCommentList(
            @PathVariable Long articleId,
            @RequestParam(defaultValue = "1")int page) {
        return ResponseEntity.ok(commentService.getCommentList(articleId, page));
    }

    @PostMapping("/{articleId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long articleId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.createComment(articleId, request));
    }

    @PutMapping("/{articleId}/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long articleId,
            @PathVariable Long commentId,
            @RequestBody CommentRequest request) throws AccessDeniedException {
        return ResponseEntity.ok(commentService.updateComment(articleId, commentId, request));
    }

    @DeleteMapping("/{articleId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long articleId,
            @PathVariable Long commentId) throws AccessDeniedException {
        commentService.deleteComment(articleId, commentId);
        return ResponseEntity.noContent().build();
    }


}
