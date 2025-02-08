FROM node:22-alpine AS build-stage

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Nginx를 위한 최종 이미지
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Vue 빌드 결과물을 Nginx 컨테이너로 복사
COPY --from=build-stage /app/dist .

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
