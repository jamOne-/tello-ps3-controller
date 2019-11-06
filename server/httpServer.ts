import * as http from "http";
import * as express from "express";
import { AddVideoListenerFn } from "./liveStream2";

export function init(): http.Server {
  const app = express();
  const httpServer = http.createServer(app);

  app.use("/", express.static("build"));
  // app.use("/video", (req, res) => {
  //   res.writeHead(200, {
  //     Connection: "keep-alive",
  //     "Content-Type": "video/mp4",
  //     "Accept-Ranges": "bytes" // Helps Chrome
  //   });

  //   const removeFn = addVideoListenerFn(res);

  //   req.on("close", () => {
  //     console.log("Client: req close");
  //     removeFn();
  //   });

  //   req.on("end", () => {
  //     console.log("Client: req end");
  //     removeFn();
  //   });
  // });

  return httpServer;
}
