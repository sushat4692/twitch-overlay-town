import React from "react";
import { TilingSprite } from "@inlet/react-pixi";
import { BlockSize, BlockXLength, BlockYLength } from "@/const/Town";
import { WindowGap } from "@/const/Window";

// Images
import GrassImage from "@/assets/Grass.png";

export const Grid: React.FC = () => {
  return (
    <TilingSprite
      image={GrassImage}
      x={WindowGap}
      y={WindowGap}
      width={BlockSize * BlockXLength}
      height={BlockSize * BlockYLength}
      tilePosition={{ x: 0, y: 0 }}
      tileScale={{ x: 0.3, y: 0.3 }}
    />
  );
};
