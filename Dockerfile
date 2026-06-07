# Dockerfile: build estático de Vite servido con nginx
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
