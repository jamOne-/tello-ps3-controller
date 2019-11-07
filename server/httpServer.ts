import * as http from "http";
import * as express from "express";

export function init(): http.Server {
  const app = express();
  const httpServer = http.createServer(app);

  app.use("/", express.static("build"));
  app.use("/live", express.static("live"));

  return httpServer;
}
