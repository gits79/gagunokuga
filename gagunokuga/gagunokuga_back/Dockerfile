# openjdk 17을 사용한 이미지 빌드
FROM openjdk:17
# 컨테이너 안에서 /app 경로 안에서 작업을 하겠다
WORKDIR /app
# bulid/libs안에 있는 jar 파일을 app.jar라는 이름으로 컨테이너 안에 복사
# 위에서 경로를 /app 이라 설정했기때문에 /app 안에 app.jar라는 파일이 생김
COPY build/libs/*.jar app.jar
# 8080포트 사용
EXPOSE 8080
# java -jar /app/app.jar 라는 명령어 실행 ENTRYPOINT는 CMD와 같은 명령어 입력이라 생각
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
