#!/bin/bash

# SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
# SPDX-FileCopyrightText: 2024 Florian Heinrich <florian.heinrich@dlr.de>
#
# SPDX-License-Identifier: Apache-2.0

# replace environment variables (with prefix "FL_") in nginx.conf
envsubst "$(env | awk -F= '/^FL_/ {print "$"$1}' | tr '\n' ' ')" < /etc/nginx/nginx.conf > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/nginx.conf

# start nginx daemon
nginx -g 'daemon off;'
