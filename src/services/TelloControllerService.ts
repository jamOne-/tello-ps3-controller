import * as _ from "lodash";
import { Axes, ButtonsMap } from "./ControllerService";

export type TelloCommand =
  | { type: "takeoff" }
  | { type: "land" }
  | { type: "rc"; lr: number; fb: number; ud: number; yaw: number };

export type CommandListener = (command: TelloCommand) => void;

export class TelloControllerService {
  private _commandListener: CommandListener;

  constructor(commandListener: CommandListener) {
    this._commandListener = _.throttle(commandListener, 50);
  }

  update(axes: Axes, buttons: ButtonsMap): void {
    if (buttons.l2.value === 1 && buttons.r2.value === 1) {
      return this._commandListener({ type: "takeoff" });
    }

    if (buttons.l1.value === 1 && buttons.r1.value === 1) {
      return this._commandListener({ type: "land" });
    }

    const [x1, y1, yaw, y2] = axes;
    const valueFactor = 0.75;

    this._commandListener({
      type: "rc",
      lr: Math.round(x1 * 100 * valueFactor),
      fb: Math.round(-y1 * 100 * valueFactor),
      ud: Math.round(-y2 * 100 * valueFactor),
      yaw: Math.round(yaw * 100 * valueFactor)
    });
  }
}
