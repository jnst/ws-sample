import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AddressInfo } from 'net';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const REGEX_BROADCAST = /^broadcast\:/;

wss.on('connection', (ws: WebSocket) => {

  ws.on('message', (message: string) => {
    console.log('received: %s', message);

    if (REGEX_BROADCAST.test(message)) {
      message = message.replace(REGEX_BROADCAST, '');
      wss.clients.forEach(client => {
        if (client != ws) {
          client.send(`Hello, broad cast message -> ${message}`);
        } else {
          console.log(`self message: ${message}`);
        }
      });
    } else {
      ws.send(`Hello, you sent -> ${message}`);
    }
  });

  ws.send('Hi there, I am a WebSocket server');

});

server.listen(process.env.PORT || 8999, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`Server started on port ${port} :)`);
});
