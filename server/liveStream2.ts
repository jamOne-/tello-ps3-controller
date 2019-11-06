import * as child_process from "child_process";
import { Readable, Writable } from "stream";

export type AddVideoListenerFn = (listener: Writable) => () => void;

const INPUT_ADDRESS = "udp://0.0.0.0:11111";

export function startLiveStream(): AddVideoListenerFn {
  const ffmpegProcess = child_process.spawn(
    "ffmpeg",
    [
      "-i",
      INPUT_ADDRESS,
      "-c:v",
      "libx264",
      // "-hide_banner",
      "-crf",
      "51",
      "-b:v",
      "500k",
      "-tune",
      "zerolatency",
      "-preset",
      "ultrafast",
      "-strict",
      "experimental",
      "-f",
      "mp4",
      // "-vcodec",
      // "copy",
      "-r",
      "25",
      "-movflags",
      "frag_keyframe+empty_moov",
      // "-reset_timestamps",
      // "1",
      // "-vsync",
      // "1",
      // "-flags",
      // "global_header",
      // "-bsf:v",
      // "dump_extra",
      // "-y",
      "-" // output to stdout
    ],
    { detached: false }
  );

  ffmpegProcess.stderr.on("data", data =>
    console.log(`FFMPEG stderr: ${data}`)
  );

  ffmpegProcess.on("exit", code =>
    console.log(`FFMPEG terminated with code ${code}`)
  );

  return addStreamListener.bind(undefined, ffmpegProcess.stdout);
}

function addStreamListener(stream: Readable, listener: Writable): () => void {
  stream.pipe(listener);
  return () => stream.unpipe(listener);
}
