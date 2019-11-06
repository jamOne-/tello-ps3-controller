// based on https://github.com/jaredpetersen/raspi-live/blob/master/lib/server.js

import * as ffmpeg from "fluent-ffmpeg";
import * as path from "path";
import * as sb from "stream-buffers";

export class VideoStream {
  private _cameraStream: sb.ReadableStreamBuffer = new sb.ReadableStreamBuffer();
  private _videoPackets: Buffer[] = [];

  constructor() {
    // this._cameraStream.on("data", console.log);
  }

  handleVideoChunk(videoChunk: Buffer): void {
    this._videoPackets.push(videoChunk);

    if (videoChunk.length !== 1460) {
      this._cameraStream.put(Buffer.concat(this._videoPackets));
      this._cameraStream.resume();
      // console.log(Buffer.concat(this._videoPackets));
      this._videoPackets = [];
    }
  }

  createVideoStreamFile(): void {
    const time = "2";
    const listSize = "10";
    const storageSize = "10";
    const directory = "./";

    const outputOptions = [
      "-hls_time",
      time,
      "-hls_list_size",
      listSize,
      "-hls_delete_threshold",
      storageSize,
      "-hls_flags",
      "split_by_time+delete_segments+second_level_segment_index",
      "-strftime",
      "1",
      "-hls_segment_filename",
      path.join(directory, "%s-%%d.m4s"),
      "-hls_segment_type",
      "fmp4"
    ];

    ffmpeg()
      .input(this._cameraStream)
      .on("start", function(commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("error", function(err, stdout, stderr) {
        //   console.log('ffmpeg stdout: ' + stdout);
        console.log("ffmpeg stderr: " + stderr);
      })
      .on("end", function() {
        console.log("ended");
      })
      .noAudio()
      .videoCodec("copy")
      .format("hls")
      .inputOptions(["-re"])
      .outputOptions(outputOptions)
      .output(path.join(directory, "livestream.m3u8"));
  }
}
