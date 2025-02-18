package com.example.gagunokuga_back.image.controller;

import com.example.gagunokuga_back.image.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadImage(file);
            System.out.println(imageUrl);
            return "File uploaded successfully! imageUrl: " + imageUrl;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return "File upload failed!";
        }
    }
}
