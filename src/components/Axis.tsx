import React, { Component } from "react";
import "../styles/Axis.css";

interface Props {
  x: number;
  y: number;
}

class Axis extends Component<Props> {
  render() {
    const INNER_SIZE = 120;
    const { x, y } = this.props;
    const styles = {
      transform: `translate(${(x * INNER_SIZE) / 2}px, ${(y * INNER_SIZE) /
        2}px)`
    };

    return (
      <div className="Axis">
        <div className="Axis-inner" style={styles}></div>
      </div>
    );
  }
}

export default Axis;
