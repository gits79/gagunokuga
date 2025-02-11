# 기존 nodejs로 빌드하는 거 젠킨스에서 실행

# Nginx를 위한 최종 이미지
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Vue 빌드 결과물을(정적파일 SPA) Nginx 컨테이너로 복사
COPY dist .

# Nginx 설정 복사
#COPY nginx.conf /etc/nginx/nginx.conf 볼륨 마운트로 대체

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


