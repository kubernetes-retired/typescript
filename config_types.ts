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
            throw new Error("'name' missing");
        }
        if (!elt.cluster['certificate-authority-data']) {
            throw new Error("'certificate-authority-data' missing");
        }
        if (!elt.cluster['server']) {
            throw new Error("'server' missing");
        }
        console.log("pusing a cluster");
        ret.push({
            name: elt['name'],
            caData: elt.cluster['certificate-authority-data'],
            server: elt.cluster['server']
        });
    }
    console.log(`returning ${ret.length} clusters`);
    return ret
}

export interface User { }

export function newUsers(a: any): User[] {
    return Array<User>();
}

export interface Context { }

export function newContexts(a: any): Context[] {
    return Array<Context>();
}
