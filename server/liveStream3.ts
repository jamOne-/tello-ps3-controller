import * as child_process from "child_process";
import * as fs from "fs";

const INPUT_ADDRESS = "udp://0.0.0.0:11111";

export function startLiveStream(listener: (chunk: any) => void): void {
  const ffmpegProcess = child_process.spawn(
    "ffmpeg",
    [
      "-hide_banner",
      "-i",
      INPUT_ADDRESS,
      "-vcodec",
      "libx264",
      // "copy",
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
      // "-profile:v",
      // "baseline",
      // "-level",
      // "3.0",
      "-r",
      "20",
      "-f",
      "mp4",
      "-movflags",
      "frag_keyframe+empty_moov+omit_tfhd_offset+default_base_moof",
      "-probesize",
      "2000",
      "-g",
      "2",
      // "-reset_timestamps",
      // "1",
      // "-vsync",
      // "1",
      // "-flags",
      // "global_header",
      // "-bsf:v",
      // "dump_extra",
      "-y",
      "-" // output to stdout
    ],
    { detached: false }
  );

  ffmpegProcess.stdout.on("data", listener);

  ffmpegProcess.stderr.on("data", data =>
    console.log(`FFMPEG stderr: ${data}`)
  );

  ffmpegProcess.on("exit", code =>
    console.log(`FFMPEG terminated with code ${code}`)
  );

  // const chunks: any[] = [];
  // const stream = fs.createReadStream("test.mp4");
  // stream.on("data", listener);
}
