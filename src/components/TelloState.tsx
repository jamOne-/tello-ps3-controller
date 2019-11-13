import "../styles/TelloState.css";
import React from "react";

interface TelloState {
  pitch: number;
  roll: number;
  yaw: number;
  vgx: number;
  vgy: number;
  vgz: number;
  templ: number;
  temph: number;
  tof: number;
  h: number;
  bat: number;
  baro: number;
  time: number;
  agx: number;
  agy: number;
  agz: number;
}

interface Props {
  telloStateString: string | undefined;
}

function TelloStateComponent({ telloStateString }: Props) {
  if (!telloStateString) {
    return null;
    // telloStateString =
    //   "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:57;temph:59;tof:10;h:0;bat:92;baro:130.00;time:0;agx:-12.00;agy:16.00;agz:-998.00;";
  }

  const telloState = decodeTelloState(telloStateString);

  return (
    <div className="TelloState">
      <ul className="TelloState__row">
        <li className="TelloState__item">Battery: {telloState.bat}%</li>
        <li className="TelloState__item">Altitude: {telloState.h}cm</li>
        <li className="TelloState__item">Barometer: {telloState.baro}cm</li>
        <li className="TelloState__item">ToF: {telloState.tof}cm</li>
        <li className="TelloState__item">Time: {telloState.time}s</li>
        <li className="TelloState__item">
          Temperature lo–hi: {telloState.templ}°–{telloState.temph}°
        </li>
      </ul>

      <ul className="TelloState__row">
        <li className="TelloState__item">Pitch: {telloState.pitch}°</li>
        <li className="TelloState__item">Roll: {telloState.roll}°</li>
        <li className="TelloState__item">Yaw: {telloState.yaw}°</li>

        <li className="TelloState__item">
          Velocity: {telloState.vgx}, {telloState.vgy}, {telloState.vgz}
        </li>
        <li className="TelloState__item">
          Acceleration: {telloState.agx}, {telloState.agy}, {telloState.agz}
        </li>
      </ul>
    </div>
  );
}

function decodeTelloState(state: string): TelloState {
  state.trimEnd();

  return state.split(";").reduce((telloState, s) => {
    const split = s.split(":");

    if (split.length === 2) {
      const [key, value] = split;
      telloState[key] = parseFloat(value);
    }

    return telloState;
  }, {} as TelloState);
}

export default TelloStateComponent;
