# Stage 1: Build Angular app
FROM node:latest AS build
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build --prod

# Stage 2: Serve Angular app with Nginx
FROM nginx:latest
COPY --from=build /app/dist/paris /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
