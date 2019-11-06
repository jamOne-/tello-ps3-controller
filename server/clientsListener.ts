import * as http from "http";
import * as socketIo from "socket.io";
import { startLiveStream } from "./liveStream3";

type Client = socketIo.Socket;
type SendStateFn = (state: Buffer) => void;

export function init(http: http.Server): SendStateFn {
  const clients: Client[] = [];
  const io = socketIo(http, { transports: ["websocket"] });

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

    socket.on("command", (command: any) => {
      console.log(`Command received: ${command}`);
    });

    startLiveStream(socket.emit.bind(socket, "video"));
  });

  function sendStateToClients(state: Buffer): void {
    for (const client of clients) {
      client.emit("state", state);
    }
  }

  return sendStateToClients;
}
