import * as u from 'underscore';

export interface Cluster {
    readonly name: string;
    readonly caData: string;
    readonly server: string;
}

export function newClusters(a: any): Cluster[] {
    let ret = new Array<Cluster>();
    const len = a.length
    for (let i = 0; i < len; i++) {
        let elt = a[i];
        if (!elt['name']) {
            throw new Error(`clusters${i}.name is missing`);
        }
        if (!elt.cluster['certificate-authority-data']) {
            throw new Error(`clusters[${i}].cluster.certificate-authority-data is missing`);
        }
        if (!elt.cluster['server']) {
            throw new Error(`clusters[${i}].cluster.server is missing`);
        }
        ret.push({
            name: elt['name'],
            caData: elt.cluster['certificate-authority-data'],
            server: elt.cluster['server']
        });
    }
    return ret
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
            throw new Error(`contexts[${i}].name is missing`);
        }
        if (!elt.user["client-certificate-data"]) {
            throw new Error(`contexts[${i}].user.client-certificate-data is missing`);
        }
        if (!elt.user["client-key-data"]) {
            throw new Error(`contexts[${i}].user.client-key-data is missing`);
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
    return Array<Context>();
}
