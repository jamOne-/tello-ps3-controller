export class ControllerService {
  private _controllerIndex: number | null = null;
  private static _instance: ControllerService | null = null;

  static get instance(): ControllerService {
    if (this._instance === null) {
      this._instance = new ControllerService();
    }

    return this._instance;
  }

  private constructor() {}

  init() {
    window.addEventListener("gamepadconnected" as any, this.onPadConnected); // todo
    window.addEventListener("gamepaddisconnected", this.onPadDisconnected);
  }

  get controller(): Gamepad | null {
    if (this._controllerIndex !== null) {
      return navigator.getGamepads()[this._controllerIndex];
    } else {
      return null;
    }
  }

  onPadConnected = (event: GamepadEventInit) => {
    if (event.gamepad === undefined) {
      console.error("onPadConnected: event.gamepad is undefined");
      return;
    }

    if (event.gamepad.axes.length < 4) {
      console.warn("onPadConnected: wrong pad connected");
      return;
    }

    this._controllerIndex = event.gamepad.index;
    console.log("Gamepad connected.");
  };

  onPadDisconnected = () => {
    this._controllerIndex = null;
    console.log("Gamepad disconnected.");
  };

  getAxes(): Axes {
    if (this.controller === null) {
      return [0, 0, 0, 0];
    }

    const axes = this.controller.axes;
    return axes as Axes;
  }

  getButtons(): ButtonsMap {
    const buttons =
      (this.controller && this.controller.buttons) ||
      createEmptyButtonsArray(Object.entries(BUTTONS).length);

    return BUTTONS.reduce(
      (buttonsMap, key, index) =>
        (buttonsMap[key] = buttons[index]) && buttonsMap,
      {} as ButtonsMap
    );
  }
}

function createEmptyButtonsArray(length: number): GamepadButton[] {
  const buttons: GamepadButton[] = [];

  for (let i = 0; i < length; i++) {
    buttons.push({ value: 0, pressed: false, touched: false });
  }

  return buttons;
}

const BUTTONS = [
  "cross",
  "circle",
  "square",
  "triangle",
  "l1",
  "r1",
  "l2",
  "r2",
  "select",
  "start",
  "l3",
  "r3",
  "up",
  "down",
  "left",
  "right"
] as const;

export type Axes = [number, number, number, number];

export type ButtonsMap = {
  [K in typeof BUTTONS[number]]: GamepadButton;
};
