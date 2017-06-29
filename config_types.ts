import * as u from 'underscore';

export interface Cluster {
    readonly name: string;
    readonly caData: string;
    readonly server: string;
}

export function newClusters(a: any): Cluster[] {
    return u.map(a, clusterIterator())
}

function clusterIterator(): u.ListIterator<any, Cluster> {
    return function (elt: any, i: number, list: u.List<any>): Cluster {
        if (!elt['name']) {
            throw new Error(`clusters${i}.name is missing`);
        }
        if (!elt.cluster['certificate-authority-data']) {
            throw new Error(`clusters[${i}].cluster.certificate-authority-data is missing`);
        }
        if (!elt.cluster['server']) {
            throw new Error(`clusters[${i}].cluster.server is missing`);
        }
        return {
            name: elt['name'],
            caData: elt.cluster['certificate-authority-data'],
            server: elt.cluster['server']
        };
    }
}

export interface User {
    readonly name: string
    readonly certData: string
    readonly keyData: string
}

export function newUsers(a: any): User[] {
    return u.map(a, userIterator());
}

function userIterator(): u.ListIterator<any, User> {
    return function (elt: any, i: number, list: u.List<any>): User {
        if (!elt.name) {
            throw new Error(`users[${i}].name is missing`);
        }
        if (!elt.user["client-certificate-data"]) {
            throw new Error(`users[${i}].user.client-certificate-data is missing`);
        }
        if (!elt.user["client-key-data"]) {
            throw new Error(`users[${i}].user.client-key-data is missing`);
        }
        return {
            name: elt.name,
            certData: elt.user["client-certificate-data"],
            keyData: elt.user["client-key-data"]
        }
    }
}

export interface Context {
    readonly cluster: string
    readonly user: string
    readonly name: string
}

export function newContexts(a: any): Context[] {
    return u.map(a, contextIterator());
}

function contextIterator(): u.ListIterator<any, Context> {
    return function (elt: any, i: number, list: u.List<any>): Context {
        if (!elt.name) {
            throw new Error(`contexts[${i}].name is missing`);
        }
        if (!elt.context["cluster"]) {
            throw new Error(`contexts[${i}].context.cluster is missing`);
        }
        if (!elt.context["user"]) {
            throw new Error(`context[${i}].context.user is missing`);
        }
        return {
            cluster: elt.context['cluster'],
            user: elt.context["user"],
            name: elt.name
        };
    }
}
