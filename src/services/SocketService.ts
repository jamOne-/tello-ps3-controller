import io from "socket.io-client";

export class SocketService {
  static get instance(): SocketService {
    if (this._instance === undefined) {
      this._instance = new SocketService();
    }

    return this._instance;
  }

  private static _instance: SocketService | undefined;
  private _socket: SocketIOClient.Socket | undefined;

  private constructor() {}

  get socket(): SocketIOClient.Socket {
    if (!this._socket) {
      throw new Error("Socket is null");
    }

    return this._socket;
  }

  connect(): void {
    const socket = io();
    this._socket = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  registerHandler(event: string, fn: Function): void {
    this.socket.on(event, fn);
  }

  send(event: string, value?: any): void {
    this.socket.emit(event, value);
  }
}
