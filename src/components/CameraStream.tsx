import React, { Component } from "react";
import "../styles/CameraStream.css";
import { SocketService } from "../services/SocketService";

interface Props {}

class CameraStream extends Component<Props> {
  private _videoRef = React.createRef<HTMLVideoElement>();

  componentDidMount() {
    const videoElement = this._videoRef.current;
    const mediaSource = new MediaSource();
    const url = URL.createObjectURL(mediaSource);
    videoElement.src = url;

    mediaSource.addEventListener("sourceopen", () => {
      console.log("SOURCE OPEN");
      const videoSourceBuffer = mediaSource.addSourceBuffer(
        'video/mp4;codecs="avc1.42e01e"'
      );

      const queue = [];
      const socketService = SocketService.instance;
      socketService.registerHandler("video", (chunk: Buffer) => {
        console.log(chunk);

        const arr = new Uint8Array(chunk);

        if (videoSourceBuffer.updating || queue.length > 0) {
          queue.push(arr);
          console.log(queue.length);
        } else {
          videoSourceBuffer.appendBuffer(arr);
        }
      });

      videoSourceBuffer.addEventListener("updateend", () => {
        if (queue.length && !videoSourceBuffer.updating) {
          videoSourceBuffer.appendBuffer(queue.shift());
        } else {
          console.log(queue.length == 0);
          // console.log(mediaSource.readyState);
          // setTimeout(() => mediaSource.endOfStream(), 3000);
          // videoElement.play();
        }
      });
    });
  }

  render() {
    return <video autoPlay ref={this._videoRef} controls />;
  }
}

export default CameraStream;
