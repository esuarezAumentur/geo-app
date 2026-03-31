FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html env.d.ts vite.config.ts ./
COPY tsconfig*.json ./
COPY src/ ./src/

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
