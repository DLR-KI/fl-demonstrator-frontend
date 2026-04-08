<!--
SPDX-FileCopyrightText: 2026 German Aerospace Center (DLR)
SPDX-License-Identifier: Apache-2.0
-->

# Federated Learning Demonstrator Frontend

[![DOI](https://zenodo.org/badge/770825672.svg)](https://doi.org/10.5281/zenodo.13951222 )

The amazing frontend for the Federated Learning Demonstrator build and optimized for Catena-X.
The frontend is written in [TypeScript](https://www.typescriptlang.org) using the [React](https://react.dev) framework.

The Federated Learning (FL) platform is serving as a proof of concept for the [Catena-X](https://catena-x.net/en) project.
The FL platform aims to demonstrate the potential of federated learning in a practical, real-world context.

A complete list of all repositories relevant to the FL platform can be found [here](https://dlr-ki.github.io/fl-documentation#repositories).

## Get Started

This README.md is primarily intended for developers and contributors, providing necessary information for setup, installation, and contribution guidelines.
If you're interested in using or testing this project, we recommend starting with the [GitHub pages](https://dlr-ki.github.io/fl-demonstrator-frontend) which serves this documentation.
They offer a more user-friendly interface and comprehensive guides to get you started.

For local development, this frontend expects the FL Demonstrator backend to be available under `/api`.
When running the frontend with Vite, it starts on port `3000` and proxies `/api` requests to `http://localhost:8000` by default.
If your backend runs on a different port, set `VITE_FL_SERVER_BASE_URL` before starting the dev server.

## Requirements

- [Federated Learning Demonstrator Server](https://github.com/DLR-KI/fl-demonstrator)
- [NodeJS](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
    source ~/.bashrc
    nvm install --lts
    nvm use --lts
    ```

- Python 3.10 or later  
    `which python`
- [uv](https://docs.astral.sh/uv/)  
    `curl -LsSf https://astral.sh/uv/install.sh | sh`

## Install

```bash
# install all dependencies
npm install
```

## Local Development

Start the backend first.
If it listens on `http://localhost:8000`, start the frontend like this:

```bash
VITE_FL_SERVER_BASE_URL=http://localhost:8000 npm start
```

This launches the Vite dev server.
Open <http://localhost:3000> to use the application.

The documentation is written in markdown and rendered with [Zensical](https://zensical.org/).
Hence, `zensical` needs to be installed.

```bash
# install docs dependencies
uv venv
uv pip install -U zensical
```

## Available Scripts

In the project directory, the following actions are available:

- `npm install`

    Installs all relevant dependencies

- `npm start`

- `npm run dev`

    Runs the app in the development mode.
    `npm start` and `npm run dev` are equivalent and both start the Vite dev server.
    Open <http://localhost:3000> to view it in the browser.

    The page reloads automatically when you make edits.

- `npm test`

    Runs the test suite once with Vitest.

    To run the test suite in watch mode:

    ```bash
    npm run test:watch
    ```

    To print a coverage report:

    ```bash
    npm test -- --coverage
    ```

- `npm run build`

    Builds the app for production to the `build` folder.
    This creates the static assets served by the production container.

- `npm run build:docker`
  
    Creates a Docker container image of the app in production mode with the tag `local/fl-frontend:latest`.
    Afterwards, a container instance can be started with `docker run --name nginx --rm --network host local/fl-frontend:latest`.
    Open <http://localhost:8080> to view the result in the browser.

- `npm run build:doc`

    Builds the documentation with zensical.

- `npm run doc`

    Serves the documentation with zensical.

- `npm run lint`

    Run all linter.

- `npm run lint:code`

    Run static code analysis.

- `npm run lint:doc`

    Run markdown code analysis for documentation and README.md.

- `npm run preview`

    Serves the production build locally for a final verification pass.

## Credits

<div>
    <div style="display: inline-block; width: 42%;">
        <img src="./docs/assets/logo/DLR_Logo_EN_black.svg#gh-light-mode-only" alt="DLR" style="width: 100%;" />
        <img src="./docs/assets/logo/DLR_Logo_EN_white.svg#gh-dark-mode-only" alt="DLR" style="width: 100%" />
        <div style="text-align: center;">
            <img src="./docs/assets/logo/catena-x-black.svg#gh-light-mode-only" alt="Catena-X" style="width: 80%;" />
            <img src="./docs/assets/logo/catena-x-white.svg#gh-dark-mode-only" alt="Catena-X" style="width: 80%;" />
        </div>
    </div>
    <div style="display: inline-block; width: 55%; float: right;">
        <img src="./docs/assets/logo/EN_fundedbyEU_VERTICAL_RGB_POS.svg#gh-light-mode-only" alt="European Union" style="width: 44%;" />
        <img src="./docs/assets/logo/EN_fundedbyEU_VERTICAL_RGB_NEG.svg#gh-dark-mode-only" alt="European Union" style="width: 44%;" />
        <img src="./docs/assets/logo/bmwk_en.png" alt="BMWK" style="width: 44%; float: right;" />
    </div>
</div>
