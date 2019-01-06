import React, { Component } from "react";
import "../styles/App.css";
import CameraStream from "./CameraStream";
import Axis from "./Axis";
import { ControllerService, Axes } from "../services/ControllerService";

interface State {
  axes: Axes;
}

class App extends Component<{}, State> {
  private _controllerService: ControllerService | undefined;
  private _tickSubscription: number | undefined;

  state = {
    axes: [0, 0, 0, 0] as Axes
  };

  componentWillMount() {
    this._controllerService = new ControllerService();
    this._tickSubscription = window.setInterval(this.tick, 1000 / 60);
  }

  componentWillUnmount() {
    window.clearInterval(this._tickSubscription);
  }

  tick = () => {
    const axes = this._controllerService!.getAxes();
    console.log(axes);

    this.setState({ axes });
  };

  render() {
    const [x1, y1, x2, y2] = this.state.axes;

    return (
      <div className="App">
        <CameraStream />

        <div className="App-Axis-container">
          <Axis x={x1} y={y1} />
          <Axis x={x2} y={y2} />
        </div>
      </div>
    );
  }
}

export default App;
