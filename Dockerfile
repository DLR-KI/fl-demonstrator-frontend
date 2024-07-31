# SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
# SPDX-FileCopyrightText: 2024 Florian Heinrich <florian.heinrich@dlr.de>
#
# SPDX-License-Identifier: Apache-2.0

FROM node:alpine AS builder

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json package-lock.json /app/
RUN npm ci --silent

# add app
COPY ./tsconfig.json /app/tsconfig.json
COPY ./public /app/public
COPY ./src /app/src

# build app
RUN npm run build


###########################################################

#FROM nginx:stable-alpine-slim
FROM nginxinc/nginx-unprivileged

# fix path permissions
USER root
RUN mkdir /app && \
    chown -R nginx:nginx /app
USER nginx

# add Django static and Nginx configurations files
ADD --chown=nginx:nginx ./docker/admin.tar.gz ./docker/rest_framework.tar.gz /app/static/
COPY --chown=nginx:nginx ./docker/nginx/mime.types ./docker/nginx/nginx.conf ./docker/nginx/proxy.conf /etc/nginx/

# add App (frontend)
COPY --chown=nginx:nginx --from=builder /app/build /app
COPY --chown=nginx:nginx ./docker/docker-start.sh /app/docker-start.sh

# create log directory
RUN mkdir -p /app/logs

# Nginx environment variables
ENV FL_NGINX_SERVER_NAME=localhost \
    FL_NGINX_SERVER_PORT=8080 \
    FL_DJANGO_SERVER_NAME=localhost:8000

ENV TZ=Europe/Berlin
EXPOSE 8080
CMD ["/app/docker-start.sh"]
STOPSIGNAL SIGKILL
