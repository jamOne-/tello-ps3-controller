import * as http from "http";
import * as socketIo from "socket.io";
import * as WebSocket from "ws";
import { VideoListenerFn } from "./liveStream";
import { TelloCommandSender, TelloCommand } from "./telloController";

type Client = socketIo.Socket;
type SendStateFn = (state: Buffer) => void;

const VIDEO_WEBSOCKET_PORT = 8082;

export function init(
  http: http.Server,
  commandListener: TelloCommandSender
): [SendStateFn, VideoListenerFn] {
  const clients: Client[] = [];
  const io = socketIo(http);

  io.on("connection", socket => {
    clients.push(socket);
    console.log(`Client connected (${clients.length})`);

    socket.on("disconnect", () => {
      const index = clients.indexOf(socket);

      if (index !== -1) {
        clients.splice(index, 1);
      }

      console.log(`Client disconnected (${clients.length})`);
    });

    socket.on("command", (command: TelloCommand) => {
      console.log(`Command received: ${JSON.stringify(command)}`);
      commandListener(command);
    });
  });

  const videoSocketServer = new WebSocket.Server({
    port: VIDEO_WEBSOCKET_PORT,
    perMessageDeflate: false
  });

  videoSocketServer.on("connection", socket => {
    console.log(
      `VideoWebSocket: new connection (${videoSocketServer.clients.size})`
    );

    socket.on(
      "close",
      console.log.bind(
        console,
        `VideoWebSocket: client disconnected (${videoSocketServer.clients.size})`
      )
    );
  });

  console.log(
    `VideoWebSocket: awaiting WebSocket connections on ws://localhost:${VIDEO_WEBSOCKET_PORT}/`
  );

  function sendStateToClients(state: Buffer): void {
    for (const client of clients) {
      client.emit("state", state);
    }
  }

  function sendVideoToClients(chunk: Buffer): void {
    for (const client of videoSocketServer.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(chunk);
      }
    }
  }

  return [sendStateToClients, sendVideoToClients];
}
