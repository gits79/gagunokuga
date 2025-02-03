package com.example.gagunokuga_back.furniture.domain;

import com.example.gagunokuga_back.category.domain.Category;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "furnitures")
public class Furniture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String furnitureName;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Integer width;

    @Column(nullable = false)
    private Integer height;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
