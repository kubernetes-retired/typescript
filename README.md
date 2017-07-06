# typescript client for Kubernetes

[![Build Status](https://travis-ci.org/kubernetes-client/typescript.svg?branch=master)](https://travis-ci.org/kubernetes-client/typescript)

[Alpha] Typescript client for kubernetes

Needs lots of work...

# Installing
Install nodejs

```sh
# Typescript modules
sudo npm install -g typescript ts-node

# Required libraries for the client
sudo npm install -g request bluebird js-yaml base-64
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

# Running via container

```console
$ docker run -v $HOME:/root -it brendanburns/ts-k8s
```

# Running locally
## With `ts-node`
```sh
ts-node example.ts
```

## With `tsc`
```sh
tsc example.ts
node example.js
```

