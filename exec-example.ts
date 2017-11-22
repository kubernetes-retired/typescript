import k8s = require('@kubernetes/typescript-node');
import { Exec } from './exec';


let command = process.argv[2];

let kc = new k8s.KubeConfig();
kc.loadFromFile(process.env['HOME'] + '/.kube/config');

let exec = new Exec(kc);
exec.exec('default', 'nginx-4217019353-tmc2j', 'nginx', command, process.stdout, process.stderr);
