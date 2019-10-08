import React, { Component } from "react";
import { CanvasOverlay } from "react-map-gl";

class PolyLineOverlay extends Component {
  _redraw = ({ width, height, ctx, isDragging, project, unproject }) => {
    const {
      points,
      color = "red",
      lineWidth = 2,
      renderWhileDragging = true
    } = this.props;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      points.forEach(point => {
        const pixel = project([point[1], point[0]]);
        ctx.lineTo(pixel[0], pixel[1]);
      });
      ctx.stroke();
    }
  };

  render() {
    return <CanvasOverlay redraw={this._redraw} />;
  }
}

export default PolyLineOverlay
