import ws = require('websocket');
import { KubeConfig } from '@kubernetes/typescript-node';

const protocols = [
    "v4.channel.k8s.io",
    "v3.channel.k8s.io",
    "v2.channel.k8s.io",
    "channel.k8s.io"
]

export class WebSocketHandler {
    'config': KubeConfig;

    public static readonly StdinStream = 0;
    public static readonly StdoutStream = 1;
    public static readonly StderrStream = 2;
    public static readonly StatusStream = 3;

    public constructor(config: KubeConfig) {
        this.config = config;
    }

    public connect(path: string,
                   textHandler: (text: string) => void,
                   binaryHandler: (stream: number, buff: Buffer) => void) {
        let opts = {};
        this.config.applyToRequest(opts);
        let client = new ws.client({ 'tlsOptions': opts });

        client.on('connect', (connection) => {
            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    if (textHandler) {
                        textHandler(message.utf8Data);
                    }
                }
                else if (message.type === 'binary') {
                    if (binaryHandler) {
                        let stream = message.binaryData.readInt8();
                        binaryHandler(stream, message.binaryData.slice(1));
                    }
                }
            });
        });
        
        client.on('connectFailed', (err) => {
            console.log(err);
        });
        
        client.on('httpResponse', (resp) => {
            console.log(resp);
        });

        // TODO: handle 'ws://' here.
        var url = 'wss://' + this.config.getCurrentCluster().server.substr(8) + path;

        client.connect(url, protocols);
    }
}
