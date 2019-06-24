import React, { Component } from "react";
import "../styles/App.css";
import CameraStream from "./CameraStream";
import Axis from "./Axis";
import TelloState from "./TelloState";
import { ControllerService, Axes } from "../services/ControllerService";
import { SocketService } from "../services/SocketService";

declare var Decoder: any;

interface State {
  axes: Axes;
  telloState?: string;
  videoFrame?: Buffer;
}

class App extends Component<{}, State> {
  private _controllerService: ControllerService | undefined;
  private _socketService: SocketService | undefined;
  private _tickSubscription: number | undefined;

  state = {
    axes: [0, 0, 0, 0] as Axes
  } as State;

  componentWillMount() {
    this._controllerService = new ControllerService();
    this._tickSubscription = window.setInterval(this.tick, 1000 / 60);
    this._initSocketService();
  }

  componentWillUnmount() {
    window.clearInterval(this._tickSubscription);
  }

  tick = () => {
    const axes = this._controllerService!.getAxes();
    this.setState({ axes });
  };

  render() {
    const { axes, videoFrame, telloState } = this.state;
    const [x1, y1, x2, y2] = axes;

    return (
      <div className="App">
        <TelloState telloState={telloState} />
        <CameraStream videoFrame={videoFrame} />

        <div className="App-Axis-container">
          <Axis x={x1} y={y1} />
          <Axis x={x2} y={y2} />
        </div>
      </div>
    );
  }

  private _initSocketService() {
    const textDecoder = new TextDecoder("utf-8");
    this._socketService = new SocketService();
    this._socketService.connect();

    this._socketService.registerHandler("state", (state: Buffer) => {
      const telloState = textDecoder.decode(state);
      this.setState({ telloState });
    });

    const decoder = new Decoder({ rgb: true });
    decoder.onPictureDecoded = function(buffer, width, height) {
      console.log("onPictureDecoded!", buffer, width, height);
    };

    this._socketService.registerHandler("video", (data: ArrayBuffer) => {
      decoder.decode(new Uint8Array(data));
      // this.setState({ videoFrame });
    });
  }
}

export default App;
