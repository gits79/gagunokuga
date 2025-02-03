#FROM eclipse-temurin:17-jdk
#WORKDIR /app
#COPY build/libs/*.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "app.jar"]

# Java 17 기반 이미지 사용
FROM openjdk:17

# JAR 파일을 컨테이너 내부로 복사 app.jar라는 이름으로
COPY build/libs/Gagunokuga_back-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
