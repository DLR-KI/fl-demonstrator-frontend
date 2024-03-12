# Federated Learning Demonstrator Frontend

The amazing frontend for the Federated Learning Demonstrator build and optimized for Catena-X.
The frontend is written in [TypeScript](https://www.typescriptlang.org) using the [React](https://react.dev) framework.

The Federated Learning (FL) platform is serving as a proof of concept for the [Catena-X](https://catena-x.net/en) project.
The FL platform aims to demonstrate the potential of federated learning in a practical, real-world context.

A complete list of all repositories relevant to the FL platform can be found [here](https://dlr-ki.github.io/fl-documentation#repositories).

## Get Started

This README.md is primarily intended for developers and contributors, providing necessary information for setup, installation, and contribution guidelines.
If you're interested in using or testing this project, we recommend starting with the [GitHub pages](https://dlr-ki.github.io/fl-demonstrator-frontend) which serves this documentation.
They offer a more user-friendly interface and comprehensive guides to get you started.

## Requirements

### Server

- [Federated Learning Demonstrator Server](https://github.com/DLR-KI/fl-demonstrator)

### NodeJS

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm list-remote
#Check relevant version in package.json
nvm install v<version>
```

### Python >= 3.8

```bash
sudo apt install python<version>
#If not available you can add latest versions with
sudo add-apt-repository ppa:deadsnakes/ppa 
```

### Venv

```bash
#Install venv
sudo apt install python<version>-venv
```

## Install

```bash
# install all dependencies
npm install
```

The documentation is written in markdown and rendered with [MkDocs](https://www.mkdocs.org) and its [material theme](https://squidfunk.github.io/mkdocs-material).
Hence, `mkdocs` need to be installed.

```bash
# create virtual environment
virtualenv -p $(which python<version>) .venv
# or
python<version> -m venv .venv

source .venv/bin/activate

# update pip (optional)
python -m pip install -U pip

# install
python -m pip install -U mkdocs-material
```

## Available Scripts

In the project directory, the following actions are available:

- `npm install`

    Installs all relevant dependencies

- `npm start`

    Runs the app in the development mode.
    Open <http://localhost:3000> to view it in the browser.

    Note: The page will reload if you make edits.
    You will also see any lint errors in the console.

- `npm test`

    Launches the test runner in the interactive watch mode.
    See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

    To launch all tests without any interaction as well as print the current test coverage report:

    ```bash
    npm test --silent -- --all --watchAll=false --coverage --passWithNoTests
    ```

- `npm run build`

    Builds the app for production to the `build` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.

    The build is minified and the filenames include the hashes.
    The app is ready to be deployed!
    See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

- `npm run build:docker`
  
    Creates a Docker container image of the app in production mode with the tag `local/fl-frontend:latest`.
    Afterwards, a container instance can be started with `docker run --name nginx --rm --network host local/fl-frontend:latest`.
    Open <http://localhost:8080> to view the result in the browser.

- `npm run build:doc`

    Builds the documentation with mkdocs.

- `npm run doc`

    Serves the documentation with mkdocs.

- `npm run lint`

    Run all linter.

- `npm run lint:code`

    Run static code analysis.

- `npm run lint:doc`

    Run markdown code analysis for documentation and README.md.
