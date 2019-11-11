import * as fs from "fs";
import * as child_process from "child_process";

export type VideoListenerFn = (chunk: Buffer) => void;

const INPUT_ADDRESS = "udp://0.0.0.0:11111";
const RECORD_STREAM = true;

export function startLiveStream(
  listener: VideoListenerFn
): child_process.ChildProcess {
  const ffmpegProcess = child_process.spawn(
    "ffmpeg",
    [
      "-hide_banner",
      "-i",
      INPUT_ADDRESS,
      "-vcodec",
      "mpeg1video",
      "-b:v",
      "1000k",
      "-tune",
      "zerolatency",
      "-preset",
      "ultrafast",
      "-strict",
      "experimental",
      "-r",
      "30",
      // "-probesize",
      // "2000",
      // "-g",
      // "2",
      "-f",
      "mpegts",
      "-"
    ],
    { detached: false }
  );

  let recordingStream: fs.WriteStream | null = null;
  if (RECORD_STREAM) {
    const path = `records/${Date.now()}.ts`;
    recordingStream = fs.createWriteStream(path);
  }

  ffmpegProcess.stdout.on("data", chunk => {
    listener(chunk);

    if (recordingStream !== null) {
      recordingStream.write(chunk);
    }
  });

  // ffmpegProcess.stderr.on("data", data =>
  //   console.log(`FFMPEG stderr: ${data}`)
  // );

  ffmpegProcess.on("exit", code => {
    console.log(`FFMPEG terminated with code ${code}`);

    if (recordingStream !== null) {
      recordingStream.close();
    }
  });

  return ffmpegProcess;
}
