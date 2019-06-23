import * as http from "http";
import * as socketIo from "socket.io";

type Client = socketIo.Socket;
type SendVideoFn = (video: Buffer) => void;
type SendStateFn = (state: Buffer) => void;

export function init(http: http.Server): [SendStateFn, SendVideoFn] {
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

    socket.on("command", (command: any) => {
      console.log(`Command received: ${command}`);
    });
  });

  function sendVideoToClients(video: Buffer): void {
    for (const client of clients) {
      client.send("video", video);
    }
  }

  function sendStateToClients(state: Buffer): void {
    for (const client of clients) {
      client.emit("state", state);
    }
  }

  return [sendStateToClients, sendVideoToClients];
}
