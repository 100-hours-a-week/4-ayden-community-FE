# 도커 파일 크기 문제 node -> node slim변경
FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8082

CMD ["node", "app.js"]
