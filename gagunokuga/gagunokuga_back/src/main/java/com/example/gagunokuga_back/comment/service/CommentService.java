package com.example.gagunokuga_back.comment.service;

import com.example.gagunokuga_back.comment.dto.CommentListResponse;
import com.example.gagunokuga_back.comment.dto.CommentRequest;
import com.example.gagunokuga_back.comment.dto.CommentResponse;

import java.nio.file.AccessDeniedException;

public interface CommentService {

    CommentResponse createComment(Long articleId, CommentRequest request);
    CommentResponse updateComment(Long articleId, Long commentId, CommentRequest request) throws AccessDeniedException;
    void deleteComment(Long articleId, Long commentId) throws AccessDeniedException;
    CommentListResponse getCommentList(Long articleId, int page);

}
