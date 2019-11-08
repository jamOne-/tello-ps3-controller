import * as dgram from "dgram";

const SEND_COMMAND_PORT = 8889;
const DRONE_IP_ADDRESS = "192.168.10.1";

export type TelloCommandSender = (command: TelloCommand) => void;

export type TelloCommand =
  | { type: "command" }
  | { type: "streamon" }
  | { type: "takeoff" }
  | { type: "land" }
  | { type: "rc"; lr: number; fb: number; ud: number; yaw: number };

export function initTelloController(): TelloCommandSender {
  const udpServer = dgram.createSocket("udp4");

  return command => {
    let msg: string = command.type;

    switch (command.type) {
      case "rc": {
        const { lr, fb, ud, yaw } = command;
        msg = `rc ${lr} ${fb} ${ud} ${yaw}`;
      }
    }

    udpServer.send(
      msg,
      SEND_COMMAND_PORT,
      DRONE_IP_ADDRESS,
      handleError.bind(undefined, command)
    );
  };
}

function handleError(command: TelloCommand, error: Error | null) {
  if (error) {
    console.log(
      `Tello command error: command=${JSON.stringify(command)}, error=${error}`
    );
  }
}
