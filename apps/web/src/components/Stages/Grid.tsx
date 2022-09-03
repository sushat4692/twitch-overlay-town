import React, { useCallback } from "react";
import { Graphics } from "@inlet/react-pixi";
import PIXI from "pixi.js";
import { WindowGap } from "../../const/Window";
import { BlockSize, BlockXLength, BlockYLength } from "../../const/Town";
import { useWindowValue } from "../../state/Window";

export const Grid: React.FC = () => {
  const { x, y, scale } = useWindowValue();

  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.lineStyle({ width: 1, color: 0xdddddd });

    for (let x = 0; x < BlockXLength; x += 1) {
      for (let y = 0; y < BlockYLength; y += 1) {
        g.drawRect(
          WindowGap + BlockSize * scale * x,
          WindowGap + BlockSize * scale * y,
          BlockSize * scale,
          BlockSize * scale
        );
      }
    }
  }, [scale]);

  return <Graphics x={x} y={y} draw={draw} />;
};
