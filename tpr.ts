import { V1ObjectMeta } from './api'

export interface ThirdPartyResourceInstance<Spec, Status> {
    kind: string;
    name: string;
    metadata: V1ObjectMeta;
    spec: Spec;
    status: Status;
}

export function readNamespacedTPRInstance<Spec, Status, T extends ThirdPartyResourceInstance<Spec, Status>>(
    kind: string,
    namespace: string,
    name: string,
    decoder: ([]byte): Optional<T>) {
    // TODO
    // const localVarPath = this.basePath + '/api/v1/namespaces/{namespace}/pods/{name}'
    //     .replace('{' + 'name' + '}', String(name))
    //     .replace('{' + 'namespace' + '}', String(namespace));
    // let queryParameters: any = {};
    // let headerParams: any = (<any>Object).assign({}, this.defaultHeaders);
    // let formParams: any = {};


    // // verify required parameter 'name' is not null or undefined
    // if (name === null || name === undefined) {
    //     throw new Error('Required parameter name was null or undefined when calling readNamespacedPod.');
    // }

    // // verify required parameter 'namespace' is not null or undefined
    // if (namespace === null || namespace === undefined) {
    //     throw new Error('Required parameter namespace was null or undefined when calling readNamespacedPod.');
    // }

    // if (pretty !== undefined) {
    //     queryParameters['pretty'] = pretty;
    // }

    // if (exact !== undefined) {
    //     queryParameters['exact'] = exact;
    // }

    // if (_export !== undefined) {
    //     queryParameters['export'] = _export;
    // }

    // let useFormData = false;

    // let requestOptions: request.Options = {
    //     method: 'GET',
    //     qs: queryParameters,
    //     headers: headerParams,
    //     uri: localVarPath,
    //     useQuerystring: this._useQuerystring,
    //     json: true,
    // };

    // this.authentications.BearerToken.applyToRequest(requestOptions);

    // this.authentications.default.applyToRequest(requestOptions);

    // if (Object.keys(formParams).length) {
    //     if (useFormData) {
    //         (<any>requestOptions).formData = formParams;
    //     } else {
    //         requestOptions.form = formParams;
    //     }
    // }
    // return new Promise<{ response: http.ClientResponse; body: V1Pod; }>((resolve, reject) => {
    //     request(requestOptions, (error, response, body) => {
    //         if (error) {
    //             reject(error);
    //         } else {
    //             if (response.statusCode >= 200 && response.statusCode <= 299) {
    //                 resolve({ response: response, body: body });
    //             } else {
    //                 reject({ response: response, body: body });
    //             }
    //         }
    //     });
    // });
}
