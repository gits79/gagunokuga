package com.example.gagunokuga_back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GagunokugaBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(GagunokugaBackApplication.class, args);
    }

}
