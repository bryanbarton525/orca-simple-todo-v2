# syntax=docker/dockerfile:1

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

# Production stage
FROM nginx:1.23-alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]