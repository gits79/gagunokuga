package com.example.gagunokuga_back.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

    // 인프라에서 벡엔드 켜져있는지 체크용 메서드
    @GetMapping("/api/health")
    public String healthCheck() {
        return "good~~!";
    }


}
