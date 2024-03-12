#!/bin/bash

# replace environment variables (with prefix "FL_") in nginx.conf
envsubst "$(env | awk -F= '/^FL_/ {print "$"$1}' | tr '\n' ' ')" < /etc/nginx/nginx.conf > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/nginx.conf

# start nginx daemon
nginx -g 'daemon off;'
