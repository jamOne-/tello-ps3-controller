import * as dgram from 'dgram';
import { AddressInfo } from 'net';
const server = dgram.createSocket('udp4');
const SEND_COMMAND_PORT = 8889;
const RECEIVE_STATE_PORT = 8890;
const DRONE_IP_ADDRESS = '192.168.10.1';

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address() as AddressInfo;
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(RECEIVE_STATE_PORT);
server.send('command', SEND_COMMAND_PORT, DRONE_IP_ADDRESS);
