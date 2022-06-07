### Development stage
FROM node:14-alpine as development-stage

ARG NPM_AUTH_TOKEN

RUN adduser --disabled-password --home /app --shell /bin/bash app

WORKDIR /app

ENTRYPOINT ["/entrypoint.sh"]

COPY docker/entrypoint*.sh /
COPY .npmrc package*.json ./

RUN npm install && npm cache clean --force

EXPOSE 8080

### Build stage
FROM node:14-alpine as build-stage

ARG NPM_AUTH_TOKEN

RUN adduser --disabled-password --home /app --shell /bin/bash app

USER app

WORKDIR /app

COPY .npmrc package*.json ./

RUN npm install && npm cache clean --force

COPY ./ ./

RUN npm run build

### Production stage
FROM nginx:1.19.5-alpine as production-stage

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
