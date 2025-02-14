package com.example.gagunokuga_back.comment.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class CommentListResponse {
    private int totalPages;
    private List<CommentResponse> comments;
}
