import config = require('./config');
import api = require('./api');

let k8sApi = config.Config.defaultClient();

let namespace = new api.V1Namespace();
namespace.metadata = new api.V1ObjectMeta();
namespace.metadata.name = 'test';
k8sApi.createNamespace(namespace).then(
    (response) => {
        console.log('Created namespace');
        console.log(response);
        k8sApi.readNamespace(namespace.metadata.name).then(
            (response) => {
                console.log(response);
                k8sApi.deleteNamespace(namespace.metadata.name, new api.V1DeleteOptions());
            }
        )
    },
    (err) => {
        console.log('Error!: ' + err);
    }
)