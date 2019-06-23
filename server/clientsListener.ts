import * as http from 'http';
import * as socketIo from 'socket.io';

type Client = socketIo.Socket;
type SendVideoFn = (video: Buffer) => void;
type SendStateFn = (state: Buffer) => void;

export function init(http: http.Server): [SendStateFn, SendVideoFn] {
  const io = socketIo(http);
  const clients: Client[] = [];

  io.on('connection', socket => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('command', (command: any) => {
      console.log(`Command received: ${command}`);
    });
  });

  function sendVideoToClients(video: Buffer): void {
    for (const client of clients) {
      client.send('video', video);
    }
  }
  
  function sendStateToClients(state: Buffer): void {
    for (const client of clients) {
      client.send('state', state);
    }
  }

  return [sendStateToClients, sendVideoToClients];
}
