import * as dgram from "dgram";
import { AddressInfo } from "net";
import { spawn } from "child_process";
const RECEIVE_VIDEO_PORT = 11111;

export function init(videoCb: (video: Buffer) => void) {
  const server = dgram.createSocket("udp4");
  let videoPacket = Buffer.from([]);

  server.on("error", err => {
    console.log(`Video listener error:\n${err.stack}`);
    server.close();
  });

  let dupa = 0;

  server.on("message", (msg, rinfo) => {
    videoPacket = Buffer.concat([videoPacket, msg]);

    if (msg.length !== 1460) {
      videoCb(videoPacket);
      videoPacket = Buffer.from([]);
    }
  });

  server.on("listening", () => {
    const address = server.address() as AddressInfo;
    console.log(
      `Listening for video stream ${address.address}:${address.port}`
    );
  });

  server.bind(RECEIVE_VIDEO_PORT);
}
