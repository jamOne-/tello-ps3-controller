import io from "socket.io-client";

export class SocketService {
  static get instance(): SocketService {
    if (this._instance == undefined) {
      this._instance = new SocketService();
    }

    return this._instance;
  }

  private static _instance: SocketService | undefined;
  private _socket: SocketIOClient.Socket | undefined;

  connect(): void {
    const socket = io({ transports: ["websocket"], upgrade: false });
    this._socket = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  registerHandler(event: string, fn: Function): void {
    if (!this._socket) {
      throw new Error("Socket is null");
    }

    this._socket.on(event, fn);
  }

  disconnect(): void {
    if (this._socket) {
      this._socket.disconnect();
    }
  }
}
