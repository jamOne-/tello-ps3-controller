import React, { Component } from "react";
import "../styles/App.css";
import CameraStream from "./CameraStream";
import Axis from "./Axis";
import TelloState from "./TelloState";
import {
  ControllerService,
  Axes,
  ButtonsMap
} from "../services/ControllerService";
import { SocketService } from "../services/SocketService";
import {
  TelloControllerService,
  TelloCommand
} from "../services/TelloControllerService";

interface State {
  axes: Axes;
  buttons: ButtonsMap;
  telloState?: string;
}

class App extends Component<{}, State> {
  private _tickSubscription: number | undefined;
  private _telloControllerService: TelloControllerService | undefined;

  state = {
    axes: [0, 0, 0, 0] as Axes
  } as State;

  componentDidMount() {
    ControllerService.instance.init();
    this._tickSubscription = window.setInterval(this.tick, 1000 / 60);
    this._initSocketService();
    this._telloControllerService = new TelloControllerService(this.sendCommand);
  }

  componentWillUnmount() {
    window.clearInterval(this._tickSubscription);
  }

  sendCommand = (command: TelloCommand) => {
    SocketService.instance.send("command", command);
  };

  tick = () => {
    const axes = ControllerService.instance.getAxes();
    const buttons = ControllerService.instance.getButtons();
    this._telloControllerService.update(axes, buttons);

    this.setState({ axes, buttons });
  };

  render() {
    const { axes, telloState } = this.state;
    const [x1, y1, x2, y2] = axes;

    return (
      <div className="App">
        <div className="App__stream-container">
          <div className="App-TelloState-container">
            <TelloState telloStateString={telloState} />
          </div>

          <CameraStream />
        </div>

        <div className="App-Axis-container">
          <Axis x={x1} y={y1} />
          <Axis x={x2} y={y2} />
        </div>
      </div>
    );
  }

  private _initSocketService() {
    const textDecoder = new TextDecoder("utf-8");
    const socketService = SocketService.instance;
    socketService.connect();

    socketService.registerHandler("state", (state: Buffer) => {
      const telloState = textDecoder.decode(state);
      this.setState({ telloState });
    });
  }
}

export default App;
