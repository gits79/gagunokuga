package com.example.gagunokuga_back.image.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageService {
    String uploadImage(MultipartFile image) throws IOException;
}
