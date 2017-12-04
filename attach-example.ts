import k8s = require('@kubernetes/typescript-node');
import { Attach } from './attach';


let kc = new k8s.KubeConfig();
kc.loadFromFile(process.env['HOME'] + '/.kube/config');

let attach = new Attach(kc);
attach.attach('default', 'nginx-4217019353-tmc2j', 'nginx', process.stdout, process.stderr, null /* stdin */, false /* tty */);
