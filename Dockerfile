
# build stage
FROM node:14.16 as build-stage
ARG MODE=prod
ENV ENV_TEST=$MODE 
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build:$MODE

# production stage
FROM nginx:stable-alpine as production-stage
COPY dockerconfig/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]