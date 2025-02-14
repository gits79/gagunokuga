package com.example.gagunokuga_back.comment.service;

import com.example.gagunokuga_back.article.domain.Article;
import com.example.gagunokuga_back.article.repository.ArticleRepository;
import com.example.gagunokuga_back.comment.domain.Comment;
import com.example.gagunokuga_back.comment.dto.CommentListResponse;
import com.example.gagunokuga_back.comment.dto.CommentRequest;
import com.example.gagunokuga_back.comment.dto.CommentResponse;
import com.example.gagunokuga_back.comment.repository.CommentRepository;
import com.example.gagunokuga_back.user.domain.User;
import com.example.gagunokuga_back.user.repository.UserRepository;
import com.example.gagunokuga_back.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final UserService userService;


    @Override
    public CommentListResponse getCommentList(Long articleId, int page) {
        Article article = articleRepository.findById(articleId).orElseThrow((
                () -> new IllegalArgumentException("게시글이 없습니다.")));
        Pageable pageable = PageRequest.of(page - 1, 20);
        Page<Comment> comments = commentRepository.findByArticleId(articleId, pageable);
        List<CommentResponse> commentList = new ArrayList<>();

        for (Comment comment : comments) {
            commentList.add(CommentResponse.fromEntity(comment));
        }

        return CommentListResponse.builder()
                .comments(commentList)
                .totalPages(comments.getTotalPages()).build();

    }


    @Override
    public CommentResponse createComment(Long articleId, CommentRequest request) {
        Article article = articleRepository.findById(articleId).orElseThrow((
                () -> new IllegalArgumentException("게시글이 없습니다.")));
        User currentUser = userService.getCurrentUser();
        Comment comment = request.toEntity(article, currentUser);
        commentRepository.save(comment);

        return CommentResponse.fromEntity(comment);
    }

    @Override
    public CommentResponse updateComment(Long articleId, Long commentId, CommentRequest request) throws AccessDeniedException {
        Article article = articleRepository.findById(articleId).orElseThrow((
                () -> new IllegalArgumentException("게시글이 없습니다.")));
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new IllegalArgumentException("해당 댓글이 없습니다."));
        User currentUser = userService.getCurrentUser();
        if(!comment.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("해당 댓글의 작성자가 아닙니다");
        }

        comment.update(request.getContent());

        return CommentResponse.fromEntity(comment);
    }

    @Override
    public void deleteComment(Long articleId, Long commentId) throws AccessDeniedException {
        Article article = articleRepository.findById(articleId).orElseThrow((
                () -> new IllegalArgumentException("게시글이 없습니다.")));
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new IllegalArgumentException("해당 댓글이 없습니다."));
        User currentUser = userService.getCurrentUser();

        if(!comment.getUser().getId().equals(currentUser.getId())) {

            throw new AccessDeniedException("해당 댓글의 작성자가 아닙니다");
        }
        commentRepository.delete(comment);
    }


}
