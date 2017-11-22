import querystring = require('querystring');
import stream = require('stream');

import { WebSocketHandler } from './web-socket-handler';
import { KubeConfig } from '@kubernetes/typescript-node';

export class Exec {
    'handler': WebSocketHandler;

    public constructor(config: KubeConfig) {
        this.handler = new WebSocketHandler(config);
    }        

    // TODO: make command an array and support multiple args
    public exec(namespace: string, podName: string, containerName: string, command: string, stdout: stream.Writable | any, stderr: stream.Writable | any) {
        var query = {
            stdout: stdout != null,
            stderr: stderr != null,
            command: command,
            container: containerName
        }
        var queryStr = querystring.stringify(query);
        var path = `/api/v1/namespaces/${namespace}/pods/${podName}/exec?${queryStr}`;        
        this.handler.connect(path, null, (stream: number, buff: Buffer) => {
            if (buff.length < 1) {
                return;
            }
            if (stream == WebSocketHandler.StdoutStream) {
                stdout.write(buff);
            } else if (stream == WebSocketHandler.StderrStream) {
                stderr.write(buff);
            } else if (stream == WebSocketHandler.StatusStream) {
                // stream closing.
                // TODO Parse status here.
                if (stdout) {
                    stdout.end();
                }
                if (stderr) {
                    stderr.end();
                }
            } else {
                console.log("Unknown stream: " + stream);
            }
        });
    }
}
