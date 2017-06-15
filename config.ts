import yaml = require('js-yaml');
import fs = require('fs');
import request = require('request');
import base64 = require('base-64');

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
        // TODO: Handle inline CA here
        let cluster = this.getCurrentCluster();
        let user = this.getCurrentUser();

        opts.ca = this.bufferFromFileOrString(cluster['certificate-authority'], cluster['certificate-authority-data']);
        opts.cert = this.bufferFromFileOrString(user['client-certificate'], user['client-certificate-data']);
        opts.key = this.bufferFromFileOrString(user['client-key'], user['client-key-data']);
        if (user['auth-provider']) {
            opts.headers['Authorization'] = 'Bearer ' + user['auth-provider']['config']['access-token'];
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
