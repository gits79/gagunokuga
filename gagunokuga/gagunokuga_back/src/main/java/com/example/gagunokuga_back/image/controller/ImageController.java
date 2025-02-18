package com.example.gagunokuga_back.image.controller;

import com.example.gagunokuga_back.image.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.NoSuchElementException;

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

    @GetMapping("/captureElement")
    public @ResponseBody byte[] captureElement(@RequestParam String url, @RequestParam String elementClass) throws IOException {
        System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver"); // chromedriver 경로 설정

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); // 브라우저 창 없이 실행
        WebDriver driver = new ChromeDriver(options);

        driver.get(url);

        try {
            // 특정 클래스명 요소 찾기
            WebElement element = driver.findElement(By.className(elementClass));

            // 요소 캡처
            File screenshot = element.getScreenshotAs(OutputType.FILE);

            // 파일로 저장하기
            File destinationFile = new File("/path/to/save/image.png");  // 원하는 경로로 설정
            Files.copy(screenshot.toPath(), destinationFile.toPath());   // 이미지 파일 복사

            // 파일을 byte[]로 읽기 (필요한 경우)
            byte[] imageBytes = Files.readAllBytes(destinationFile.toPath());

            driver.quit();
            return imageBytes;

        } catch (NoSuchElementException e) {
            driver.quit();
            throw new RuntimeException("요소를 찾을 수 없습니다: " + elementClass);
        }
    }
}
