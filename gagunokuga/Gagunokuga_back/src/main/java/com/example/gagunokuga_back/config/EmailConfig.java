package com.example.gagunokuga_back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class EmailConfig {
    @Bean
    public ThreadPoolTaskScheduler threadPoolTaskScheduler() {
        ThreadPoolTaskScheduler threadScheduler = new ThreadPoolTaskScheduler();
        threadScheduler.setPoolSize(10);
        threadScheduler.setThreadNamePrefix("AuthCodeScheduler-");
        threadScheduler.initialize();
        return threadScheduler;
    }

}
