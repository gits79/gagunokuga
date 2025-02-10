package com.example.gagunokuga_back.article.repository;

import com.example.gagunokuga_back.article.domain.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long>{
}
