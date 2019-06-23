import React, { Component } from "react";
import "../styles/CameraStream.css";

declare var Decoder: any;

interface Props {
  videoFrame: Buffer | undefined;
}

class CameraStream extends Component<Props> {
  private _canvasRef = React.createRef<HTMLCanvasElement>();
  private _decoder: any;

  state = {
    decodedFrame: null
  };

  constructor(props: Props) {
    super(props);
    this._decoder = new Decoder();
    this._decoder.onPictureDecoded = function(decodedFrame: any) {
      console.log("decodedFrame:", decodedFrame);

      const canvas = this._canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx!.drawImage(decodedFrame, 0, 0);
      }
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.videoFrame &&
      nextProps.videoFrame !== this.props.videoFrame
    ) {
      this._decoder.decode(nextProps.videoFrame);
    }
  }

  render() {
    return <canvas className="CameraStream" ref={this._canvasRef} />;
  }
}

export default CameraStream;
