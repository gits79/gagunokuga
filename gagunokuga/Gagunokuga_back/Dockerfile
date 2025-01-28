# Dockerfile

FROM gradle:8.0.2-jdk17 AS builder
WORKDIR /app

# Gradle 캐싱을 위한 설정
COPY build.gradle settings.gradle ./
COPY gradlew ./
COPY gradle ./gradle

# Gradle 의존성만 캐싱
RUN ./gradlew dependencies --no-daemon || true

# 실행 시 동적으로 소스 반영
CMD ["./gradlew", "bootRun", "--no-daemon"]
