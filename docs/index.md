---
title: Home
---
<!--
SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>

SPDX-License-Identifier: CC-BY-4.0
-->

<!-- markdownlint-disable-next-line MD025 -->
# Federated Learning Demonstrator Frontend

The frontend is written in [TypeScript](https://www.typescriptlang.org) using the [React](https://react.dev) framework.
It is adaptive, meaning you can use it on every device like a smartphone, tablet or desktop computer.
It connects to the FL Demonstrator [backend](https://github.com/DLR-KI/fl-demonstrator) where the actual Federated Learning is performed.

This project is a component of the Federated Learning (FL) platform, serving as a proof of concept for the [Catena-X](https://catena-x.net/en) project.
The FL platform aims to demonstrate the potential of federated learning in a practical, real-world context.

For a comprehensive understanding of the FL platform, please refer to the official [FL platform documentation](https://dlr-ki.github.io/fl-documentation).

A complete list of all repositories relevant to the FL platform can be found [here](https://dlr-ki.github.io/fl-documentation#repositories).

## Get started

The simplest way to get the frontend up running is to use Docker.

Let's assume the FL Demonstrator backend server is names `web` and is running inside the docker network `fl-demo`.

```bash
docker run --name frontend \
    -e FL_DJANGO_SERVER_NAME=web:8000 \
    -p 8080:8080 \
    --network fl-demo \
    ghcr.io/dlr-ki/fl-demonstrator-frontend:main
```

By default, the frontend exposes and runs on port `3000`.
The standard login data is `dummy-user` with password `secret`.
