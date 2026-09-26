FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx ng build

FROM nginx:alpine
COPY --from=build /app/dist/checkout-admin-angular /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
