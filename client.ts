import client = require('./auth-wrapper');
import config = require('./config');

let kc = new config.KubeConfig();
kc.loadFromFile('/home/bburns/.kube/config');

var k8sApi = new client.Core_v1Api(kc.getCurrentCluster()['server']);
k8sApi.setDefaultAuthentication(kc);

k8sApi.listNamespacedPod('default')
    .then((res) => {
        console.log(res.body);
    });
