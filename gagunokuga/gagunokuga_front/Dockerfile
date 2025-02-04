# Node.js 이미지 사용
FROM node:22.13.0

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 개발 서버 노출
EXPOSE 5173

# Vite 개발 서버 실행
CMD ["npm", "run", "dev"]
