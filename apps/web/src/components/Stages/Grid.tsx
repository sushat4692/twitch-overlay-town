import React, { useCallback } from "react";
import { Graphics } from "@inlet/react-pixi";
import PIXI from "pixi.js";
import { WindowGap } from "../../const/Window";
import { BlockSize, BlockXLength, BlockYLength } from "../../const/Town";

export const Grid: React.FC = () => {
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.lineStyle({ width: 1, color: 0xeeeeee });

      for (let x = 0; x < BlockXLength; x += 1) {
        for (let y = 0; y < BlockYLength; y += 1) {
          g.drawRect(
            WindowGap + BlockSize * x,
            WindowGap + BlockSize * y,
            BlockSize,
            BlockSize
          );
        }
      }
    },
    []
  );

  return <Graphics draw={draw} />;
};
