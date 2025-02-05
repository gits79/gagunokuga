# node를 사용하여 빌드를 하는데 build-stage라는 이름을 붙임
FROM node:22-alpine as build-stage  

WORKDIR /app  
# 컨테이너 내부에서 작업할 디렉터리를 /app으로 설정

# package.json과 package-lock.json만 먼저 복사하여 의존성 설치를 최적화함
COPY package.json package-lock.json ./  
# package.json 및 package-lock.json을 컨테이너로 복사
RUN npm ci  
# package-lock.json을 기반으로 의존성 설치 (더 빠르고 안정적인 설치)

# 모든 프로젝트 파일 복사(추후에 필요한 것만 사용해야할 예정)
COPY . .  

# Vue.js 애플리케이션 빌드
RUN npm run build 



# nginx 이미지 생성
FROM nginx:alpine  

WORKDIR /usr/share/nginx/html  
# nginx 컨테이너안에서 /usr/share/nginx/html 에서 작업하겠다는 뜻


COPY --from=build-stage /app/dist .  
# 위에서 build-stage 에서 생성한 dist/ 폴더(npm run build 하면 자동 생성)를 /usr/share/nginx/html 경로로 복사

EXPOSE 80
# Nginx가 HTTP 요청을 받을 80번 포트를 열어둠

# Nginx를 실행 (포그라운드 모드로 실행하여 컨테이너가 종료되지 않도록 함)
CMD ["nginx", "-g", "daemon off;"]  
# Nginx 가 메인 프로세스 역할을 해야 컨테이너가 유지가 되기 때문
