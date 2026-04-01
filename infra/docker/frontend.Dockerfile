FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./
RUN pnpm install

COPY index.html env.d.ts vite.config.ts ./
COPY tsconfig*.json ./
COPY src/ ./src/

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host"]
