# typescript client for Kubernetes

[![Build Status](https://travis-ci.org/kubernetes-client/typescript.svg?branch=master)](https://travis-ci.org/kubernetes-client/typescript)

_Note_: This is **alpha** software. It is under continuous improvement and is
subject to change at any time.

This is the Typescript client library for Kubernetes. It's intended to be used
in Node applications that want to talk to the Kubernetes API.

# Installing

To install and save the result to your project's local `package.json` manifest:

```console
npm install --save @kubernetes/typescript-node
```

# Development

All dependencies of this project are expressed in its 
[`package.json` file](./package.json). Before you start developing, ensure
that you have [NPM](https://www.npmjs.com/) installed, then run:

```console
npm install
```

# Testing

Tests are written using the [Chai](http://chaijs.com/) library. See
[`config_test.ts`](./config_test.ts) for an example.

To run tests, execute the following:

```console
npm test
```

# Example Code

```js
import config = require('./config');

let k8sApi = config.Config.defaultClient();

k8sApi.listNamespacedPod('default')
    .then((res) => {
        console.log(res.body);
    });
```

