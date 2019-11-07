import React, { Component } from "react";
import "../styles/CameraStream.css";

declare const JSMpeg: any;
const VIDEO_WEBSOCKET_PORT = 8082;
const STREAM_PATH = `ws://localhost:${VIDEO_WEBSOCKET_PORT}/`;

interface Props {}

class CameraStream extends Component<Props> {
  private _canvasRef = React.createRef<HTMLCanvasElement>();
  private _player: any = null;

  componentDidMount() {
    const canvas = this._canvasRef.current;
    this._player = new JSMpeg.Player(STREAM_PATH, { canvas, autoplay: true });
  }

  render() {
    return <canvas ref={this._canvasRef} className="CameraStream" />;
  }
}

export default CameraStream;
