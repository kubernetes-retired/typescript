import { KubeConfig, Config } from './config';
import { expect } from 'chai';

const kcFileName = "testdata/kubeconfig.yaml";

describe("Config", () => {
});


describe("KubeConfig", () => {
    describe("loadFromFile", () => {
        it("should load the kubeconfig file properly", () => {
            let kc = new KubeConfig();
            kc.loadFromFile(kcFileName);
            expect(kc.clusters.length).to.equal(2);
            let cluster1 = kc.clusters[0];
            expect(cluster1.name).to.equal("cluster1");
            expect(cluster1.caData).to.equal("CADATA");
            expect(cluster1.server).to.equal("http://example.com");
            // expect(kc.clusters('cluster2']).to.not.be.null;
        });
        it("should fail to load a missing kubeconfig file", () => {
            // TODO: make the error check work
            // let kc = new KubeConfig();
            // expect(kc.loadFromFile("missing.yaml")).to.throw();
        });
    });
});
