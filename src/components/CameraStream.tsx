import React, { Component } from "react";
import "../styles/CameraStream.css";

declare const JSMpeg: any;
const VIDEO_WEBSOCKET_PORT = 8082;
const STREAM_PATH = `ws://localhost:${VIDEO_WEBSOCKET_PORT}/`;
const STREAM_WIDTH = "960";
const STREAM_HEIGHT = "720";

class CameraStream extends Component {
  private _canvasRef = React.createRef<HTMLCanvasElement>();
  private _player: any = null;

  componentDidMount() {
    const canvas = this._canvasRef.current;
    this._player = new JSMpeg.Player(STREAM_PATH, {
      canvas,
      autoplay: true,
      audio: false
    });
  }

  render() {
    return (
      <canvas
        ref={this._canvasRef}
        className="CameraStream"
        width={STREAM_WIDTH}
        height={STREAM_HEIGHT}
      />
    );
  }
}

export default CameraStream;
