package com.example.gagunokuga_back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.example.gagunokuga_back") // BaseTimeEntity가 위치한 패키지
public class GagunokugaBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(GagunokugaBackApplication.class, args);
    }

}
