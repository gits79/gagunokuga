## 1. 사용한 환경 개요

### (1) 사용한 기술 스택

- **JVM**: OpenJDK 17
- **웹서버**: Nginx
- **WAS**: Spring Boot (Gradle)
- **DB**: MySQL 8
- **Cache**: Redis
- **CI/CD**: Jenkins (Docker 기반)
- **배포 환경**: AWS EC2 
- **버전 관리**: GitLab

### (2) 포트 설정

- **Nginx**: 80, 443
- **Spring Boot** : 8080 
- **MySQL**: 3306
- **Redis**: 6379
- **Jenkins**: 9090

---

## 2. 빌드 및 배포 상세 정보

### (1) 프로젝트 구조

```
/gagunokuga
  ├── gagunokuga_back  # 백엔드(Spring Boot)
  ├── gagunokuga_front # 프론트엔드(Vue.js)
  ├── docker-compose.yml
  ├── nginx.conf
```

### (2) Docker Compose 설정

### backend (Spring Boot)

- Gradle 빌드를 통해 생성된 `.jar` 파일을 컨테이너에서 실행
- MySQL과 Redis가 정상 실행된 후 시작 (`depends_on` 설정)
- 환경 변수는 `.env.production` 파일을 로드
- 컨테이너 상태를 `healthcheck`로 확인

### nginx

- `nginx.conf`를 사용하여 설정
- `docker-compose` 실행 시 Nginx가 backend보다 나중에 실행되도록 설정
- SSL 인증서를 `/etc/letsencrypt`에서 마운트

### mysql
- 볼륨을 사용하여 데이터 유지 (`mysql_data:/var/lib/mysql`)
- `healthcheck`를 통해 상태 확인

### redis

- Redis 최신 버전 사용
- 기본 설정으로 실행하며 `healthcheck` 포함

### (3) Jenkins Pipeline (CI/CD)
``` groovy
pipeline {
    agent any
    environment {
        BACKEND_DIR = 'gagunokuga_back' // 백엔드 프로젝트 디렉토리
        FRONTEND_DIR = 'gagunokuga_front' // 프론트엔드 프로젝트 디렉토리
        ROOT_DIR = 'gagunokuga' // 루트 프로젝트 디렉토리리
    }
    tools {
        nodejs "NodeJS 22"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', credentialsId: 'gitlab-credentials', url: 'https://lab.ssafy.com/s12-webmobile2-sub1/S12P11A607.git'
            }
        }
        stage('Build Backend') {
            steps {
                sh """
                cd ${ROOT_DIR}
                cd ${BACKEND_DIR}
                chmod +x gradlew  
                ./gradlew clean bootJar
                """
            }
        }
        stage('Build Frontend') {
            steps {
                sh """
                cd ${ROOT_DIR}
                cd ${FRONTEND_DIR}
                npm ci
                npm run build
                """
            }
        }
        stage('Deploy') {
            steps {
                sh """
                cd ${ROOT_DIR}
                docker-compose down
                docker-compose up -d --build
                """
            }
        }
    }
}

```

### Checkout 단계

- GitLab에서 `master` 브랜치를 클론

### Build Backend 단계

- `gradlew`를 실행하여 Spring Boot 애플리케이션을 빌드
- `bootJar` 생성 후 `build/libs`에 저장

### Build Frontend 단계

- `npm ci`로 패키지 설치 후 `npm run build` 실행

### Deploy 단계

- `docker-compose down`으로 기존 컨테이너 종료
- `docker-compose up -d --build`로 새 컨테이너 실행



