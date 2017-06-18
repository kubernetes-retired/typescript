import config = require('./config');

let k8sApi = config.Config.defaultClient();

k8sApi.listNamespacedPod('default')
    .then((res) => {
        console.log(res.body);
    });
