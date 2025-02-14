package com.example.gagunokuga_back.comment.repository;

import com.example.gagunokuga_back.comment.domain.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByArticleId(Long articleId, Pageable pageable);
}
