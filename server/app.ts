import * as _ from "lodash";
import * as dgram from "dgram";
import { init as httpServerInit } from "./httpServer";
import { init as stateListenerInit } from "./stateListener";
import { init as clientsListenerInit } from "./clientsListener";
import { startLiveStream } from "./liveStream2";

const HTTP_SERVER_PORT = 5000;
const SEND_COMMAND_PORT = 8889;
const DRONE_IP_ADDRESS = "192.168.10.1";

const udpServer = dgram.createSocket("udp4");

// const addVideoListener = startLiveStream();
const httpServer = httpServerInit();
let sendState = clientsListenerInit(httpServer);
sendState = _.throttle(sendState, 10000);
stateListenerInit(sendState);

udpServer.send("command", SEND_COMMAND_PORT, DRONE_IP_ADDRESS);
udpServer.send("streamon", SEND_COMMAND_PORT, DRONE_IP_ADDRESS);

httpServer.listen(HTTP_SERVER_PORT, () => {
  console.log(`httpServer listening on *:${HTTP_SERVER_PORT}`);
});
