import { V1ObjectMeta } from './api'

export interface ThirdPartyResourceInstance<Spec, Status> {
    kind: string;
    name: string;
    metadata: V1ObjectMeta;
    spec: Spec;
    status: Status;
}
