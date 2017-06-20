import fs = require('fs');
import os = require('os');
import path = require('path');

import base64 = require('base-64');
import jsonpath = require('jsonpath');
import request = require('request');
import shelljs = require('shelljs');
import yaml = require('js-yaml');

import client = require('./auth-wrapper');

export class KubeConfig {
    /**
     * The list of all known clusters
     */
    'clusters': Object[];

    /**
     * The list of all known users
     */
    'users': Object[];

    /**
     * The list of all known contexts
     */
    'contexts': Object[];

    /**
     * The name of the current context
     */
    'currentContext': string;

    constructor() {}

    public getContexts() {
        return this.contexts;
    }

    public getClusters() {
        return this.clusters;
    }

    public getUsers() {
        return this.users;
    }

    public getCurrentContext() {
        return this.currentContext;
    }

    public setCurrentContext(context: string) {
        this.currentContext = context;
    }

    private findObject(list: Object[], name: string, key: string) {
        for (let obj of list) {
            if (obj['name'] == name) {
                return obj[key];
            }
        }
        return null;
    }

    private getCurrentContextObject() {
        return this.getContextObject(this.currentContext);
    }

    public getContextObject(name: string) {
        return this.findObject(this.contexts, name, 'context');
    }

    public getCurrentCluster() {
        return this.getCluster(this.getCurrentContextObject()['cluster']);
    }

    public getCluster(name: string) {
        return this.findObject(this.clusters, name, 'cluster');
    }

    public getCurrentUser() {
        return this.getUser(this.getCurrentContextObject()['user']);
    }

    public getUser(name: string) {
        return this.findObject(this.users, name, 'user');
    }

    public loadFromFile(file: string) {
        this.loadFromString(fs.readFileSync(file, 'utf8'));
    }

    private bufferFromFileOrString(file: string, data: string) {
        if (file) {
            return fs.readFileSync(file);
        }
        if (data) {
            return new Buffer(base64.decode(data), 'utf-8');
        }
        return null;
    }

    public applyToRequest(opts: request.Options) {
        let cluster = this.getCurrentCluster();
        let user = this.getCurrentUser();

        opts.ca = this.bufferFromFileOrString(cluster['certificate-authority'], cluster['certificate-authority-data']);
        opts.cert = this.bufferFromFileOrString(user['client-certificate'], user['client-certificate-data']);
        opts.key = this.bufferFromFileOrString(user['client-key'], user['client-key-data']);
        let token = null;
        if (user['auth-provider'] && user['auth-provider']['config']) {
            let config = user['auth-provider']['config'];
            // This should probably be extracted as auth-provider specific plugins...
            token = 'Bearer ' + config['access-token'];
            let expiry = config['expiry'];
            if (expiry) {
                let expiration = Date.parse(expiry);
                if (expiration < Date.now()) {
                    if (config['cmd-path']) {
                        let cmd = config['cmd-path'];
                        if (config['cmd-args']) {
                            cmd = cmd + ' ' + config['cmd-args'];
                        }
                        // TODO: Cache to file?
                        let result = shelljs.exec(cmd, {silent:true});
                        if (result['code'] != 0) {
                            throw new Error('Failed to refresh token: ' + result);
                        }
                        let resultObj = JSON.parse(result.stdout.toString());

                        let path = config['token-key'];
                        // Format in file is {<query>}, so slice it out and add '$'
                        path = '$' + path.slice(1, -1);

                        config['access-token'] = jsonpath.query(resultObj, path);
                        token = 'Bearer ' + config['access-token'];
                    } else {
                        throw new Error('Token is expired!');
                    }
                }
            }
        }
        if (user['token']) {
            token = 'Bearer ' + user['token'];
        }
        if (token) {
            opts.headers['Authorization'] = token;
        }
        if (user['username']) {
            opts.auth = {
                username: user['username'],
                password: user['password']
            }
        }
    } 

    public loadFromString(config: string) {
        var obj = yaml.safeLoad(config);
        if (obj.apiVersion != 'v1') {
            throw new TypeError('unknown version: ' + obj.apiVersion);
        }
        this.clusters = obj.clusters;
        this.contexts = obj.contexts;
        this.users = obj.users;
        this.currentContext = obj['current-context'];
    }
}

export class Config {
    public static SERVICEACCOUNT_ROOT =
        '/var/run/secrets/kubernetes.io/serviceaccount';
    public static SERVICEACCOUNT_CA_PATH =
        Config.SERVICEACCOUNT_ROOT + '/ca.crt';
    public static SERVICEACCOUNT_TOKEN_PATH =
        Config.SERVICEACCOUNT_ROOT + '/token';

    public static fromFile(filename: string) {
        let kc = new KubeConfig();
        kc.loadFromFile(filename);

        let k8sApi = new client.Core_v1Api(kc.getCurrentCluster()['server']);
        k8sApi.setDefaultAuthentication(kc);

        return k8sApi;
    }

    public static fromCluster() {
        let host = process.env.KUBERNETES_SERVICE_HOST
        let port = process.env.KUBERNETES_SERVICE_PORT

        // TODO: better error checking here.
        let caCert = fs.readFileSync(Config.SERVICEACCOUNT_CA_PATH);
        let token = fs.readFileSync(Config.SERVICEACCOUNT_TOKEN_PATH);

        let k8sApi = new client.Core_v1Api('https://' + host + ':' + port);
        k8sApi.setDefaultAuthentication({
            'applyToRequest': (opts) => {
                    opts.ca = caCert;
                    opts.headers['Authorization'] = 'Bearer ' + token;            
            }
        });

        return k8sApi;
    }

    public static defaultClient() {
        if (process.env.KUBECONFIG) {
            return Config.fromFile(process.env.KUBECONFIG);
        }

        let config = path.join(process.env.HOME, ".kube", "config");
        if (fs.existsSync(config)) {
            return Config.fromFile(config);
        }

        if (fs.existsSync(Config.SERVICEACCOUNT_TOKEN_PATH)) {
            return Config.fromCluster();
        }

        return new client.Core_v1Api('http://localhost:8080');
    }
}
