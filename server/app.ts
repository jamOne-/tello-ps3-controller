import * as _ from "lodash";
import * as minimist from "minimist";
import { init as httpServerInit } from "./httpServer";
import { init as stateListenerInit } from "./stateListener";
import { init as clientsListenerInit } from "./clientsListener";
import { startLiveStream } from "./liveStream4";
import { initTelloController } from "./telloController";

const HTTP_SERVER_PORT = 5000;
const argv = minimist<{ "record-stream"?: boolean }>(process.argv.slice(2));
const recordStream = !!argv["record-stream"];

const telloCommandSender = initTelloController();
telloCommandSender({ type: "command" });
telloCommandSender({ type: "streamon" });

const httpServer = httpServerInit();
let [sendState, sendVideo] = clientsListenerInit(
  httpServer,
  telloCommandSender
);
sendState = _.throttle(sendState, 1000);
stateListenerInit(sendState);
const ffmpeg = startLiveStream(sendVideo, recordStream);

httpServer.listen(HTTP_SERVER_PORT, () => {
  console.log(`httpServer listening on *:${HTTP_SERVER_PORT}`);
});
