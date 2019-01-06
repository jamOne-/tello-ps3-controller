export class ControllerService {
  private _controllerIndex: number | null = null;

  get controller(): Gamepad | null {
    if (this._controllerIndex !== null) {
      return navigator.getGamepads()[this._controllerIndex];
    } else {
      return null;
    }
  }

  onPadConnected = (event: GamepadEventInit) => {
    if (event.gamepad === undefined) {
      console.error('onPadConnected: event.gamepad is undefined');
      return;
    }

    if (event.gamepad.axes.length < 4) {
      console.warn('onPadConnected: wrong pad connected');
      return;
    }

    this._controllerIndex = event.gamepad.index;
    console.log('Gamepad connected.');
  };

  onPadDisconnected = () => {
    this._controllerIndex = null;
    console.log('Gamepad disconnected.');
  }

  constructor() {
    window.addEventListener("gamepadconnected", this.onPadConnected);
    window.addEventListener("gamepaddisconnected", this.onPadDisconnected);
  }

  getAxes(): Axes {
    if (this.controller === null) {
      return [0, 0, 0, 0];
    }

    const axes = this.controller.axes;

    return [
      axes[0],
      axes[1],
      axes[2],
      axes[5]
    ];
  }
}

export type Axes = [number, number, number, number];
