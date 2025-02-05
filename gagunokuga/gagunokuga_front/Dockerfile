FROM node:22-alpine as build-stage
WORKDIR /app

# package.json만 먼저 복사하여 의존성 캐싱 최적화
COPY package*.json ./
RUN npm ci --only=production  

COPY . .

RUN npm run build


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build-stage /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
