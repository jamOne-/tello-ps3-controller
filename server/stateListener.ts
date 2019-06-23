import * as dgram from 'dgram';
import { AddressInfo } from 'net';
const RECEIVE_STATE_PORT = 8890;

export function init(stateCb: (state: Buffer) => void) {
  const server = dgram.createSocket('udp4');

  server.on('error', err => {
    console.log(`Tello state error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (state, rinfo) => {
    // console.log(`Tello state: ${msg} from ${rinfo.address}:${rinfo.port}`);
    stateCb(state);
  });

  server.on('listening', () => {
    const address = server.address() as AddressInfo;
    console.log(`Listening for Tello state ${address.address}:${address.port}`);
  });

  server.bind(RECEIVE_STATE_PORT);
}
