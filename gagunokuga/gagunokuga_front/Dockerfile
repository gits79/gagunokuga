FROM node:22-alpine as build-stage
WORKDIR /app


COPY package.json package-lock.json ./
RUN npm ci 

COPY . .

RUN npm run build


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build-stage /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
