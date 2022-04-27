# Employment Forms Frontend

> Web interface for Employment Forms (Help Me Forms 2.0)

[![Build status](https://badge.buildkite.com/3f88cfb196cc24faaf5f555224bbdcdd15ae04cec48bf919cd.svg?branch=master)](https://buildkite.com/myob/kiln-frontend)

This project serves as the web interface for the upcoming Employment Forms, the replacement for the current [Help Me Forms](https://helpmeforms.myob.com/).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

### Prerequisites

Ensure you have installed the following software:

- [NodeJS](https://nodejs.org/) if you want to run the frontend locally
- [Docker](https://www.docker.com/) if you want to run the frontend via docker

Ensure you have an account on Cloudsmith. See [Cloudsmith](https://hello.hub.myob.com/arts/cloudsmith.html)
for how to create an account and be added to the _prometheus_ team on Cloudsmith.
Also, follow the steps for [Authenticating with Cloudsmith from npm](https://hello.hub.myob.com/arts/cloudsmith.html#authenticating).

Finally, ensure you have the backend service running by following the guide on the [kiln-backend GitHub repository](https://github.com/MYOB-Technology/kiln-backend/blob/master/README.md).

### Dev environment

You can run `kiln-frontend` locally either using **npm** or using **docker**.

#### Launching a local dev environment using npm

1. Run `npm install` to install all dependencies
2. Copy the _.env.sample_ file to a file called _.env_
3. Ensure the following is set int he _.env_ file: `REACT_APP_KILN_BACKEND_BASEURL=http://localhost:80`
4. Run `npm start` to launch a dev environment

#### Launching a local dev environment using docker

1. Copy your local `.npmrc` file to the root directory
2. Run `docker-compose up`

After launching the dev environment using your preferred method,
open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Debugging

Below steps enable having a continuous development workflow, where it enables to write and debug code without leaving the editor.
Check the [.vscode/launch.json](.vscode/launch.json) file configuration for more information.

1. Download the latest release of VS Code and install [Chrome debugger](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome).
2. Start the backend by running `npm start`.
3. Set a breakpoint in the code.
4. Start debugging in VS Code by pressing `F5` or by clicking the `green debug icon` from `Run and Debug` selecting `"Launch Chrome against localhost:3000"`.

## Testing

### NPM Audit

To audit the current dependencies: `npm audit`.

The fix issues found: `npm audit fix`.

The build pipeline will fail if any moderate or higher vulnerabilities exist.

### Unit Testing

To run all unit tests with code coverage: `npm run test-cov`

### E2E Testing

To skip auth for e2e testing, you need turn on toggle by setting "REACT_APP_SKIP_LOGIN=true", this will only skip frontend login, you also need set backend microsoft stub "OAUTH_BASE_URL=https://employment-forms-ms-oauth-stub-master.svc.platform.myobdev.com"

### SonarQube

To perform a SonarQube scan: `npm run sonar -- -Dsonar.login=PROJECT_TOKEN`.

See [ops-kube-sonar/setup.md](https://github.com/MYOB-Technology/ops-kube-sonar/blob/master/docs/setup.md) to get a SonarQube project token.

View the results at [https://sonarqube.svc.platform.myob.com/projects](https://sonarqube.svc.platform.myob.com/projects).

## Build Pipeline

The build pipeline is managed through Buildkite, available at [https://buildkite.com/myob/kiln-frontend](https://buildkite.com/myob/kiln-frontend).

The pipeline is configured using the _buildkite.yml_ file, triggering scripts in the _ops/_ folder.

## Technical Decisions

We use [ADR](https://www.npmjs.com/package/adr) to record our architectural and technical decisions.

To add a new decision, run `adr new [decision-brief-name]`.

View decision [here](https://github.com/MYOB-Technology/kiln-frontend/adr).

### Known Issues

1. linter related

Using `// eslint-disable-next-line react-hooks/exhaustive-deps` in `useEffect` hook dependency array.
We need to manually add a comment to stop linter from automatically adding whatever appears inside of the side effect function to the dependency array. I believe it is a linter bug. Unless we find a better way of dealing with this issue, we will continue using the exclusive linter comment.

## Built with

- [React](https://reactjs.org/)
- [NodeJS](https://nodejs.org/)
- [Feelix](https://feelix.myob.com/)
- [Docker](https://www.docker.com/)

## Contributors

| Name                                                | Role                 | Email                 |
| --------------------------------------------------- | -------------------- | --------------------- |
| [Chris Livett](https://github.com/ChrisLivett-myob) | Prometheus Team Lead | chris.livett@myob.com |
| [Lin Chen](https://github.com/linchen-myob)         | Prometheus Lead Dev  | lin.chen@myob.com     |
| [Ran Meng](https://github.com/ranmengtwmyob)        | Prometheus Dev       | ran.meng@myob.com     |
| [Jia Wei](https://github.com/jiawei-myob)           | Prometheus Dev       | jia.wei@myob.com      |
| [Matthew Knight](https://github.com/mknight2241)    | Prometheus Dev       | chris.livett@myob.com |
