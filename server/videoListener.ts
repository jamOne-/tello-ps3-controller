import * as dgram from 'dgram';
import { AddressInfo } from 'net';
const RECEIVE_STATE_PORT = 11111;

export function init(videoCb: (video: Buffer) => void) {
  const server = dgram.createSocket('udp4');

  server.on('error', err => {
    console.log(`Video listener error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    // console.log(`Video listener: ${msg} from ${rinfo.address}:${rinfo.port}`);
    videoCb(msg);
  });

  server.on('listening', () => {
    const address = server.address() as AddressInfo;
    console.log(`Listening for video stream ${address.address}:${address.port}`);
  });

  server.bind(RECEIVE_STATE_PORT);
}
