import React, { useState } from "react";
import { TilingSprite, useTick } from "@inlet/react-pixi";
import { WindowGap } from "@/const/Window";
import { BlockSize, BlockXLength, BlockYLength } from "@/const/Town";

const XSPEED = 0.25;
const YSPEED = 0.1;
const TILE_WIDTH = 1200;
const TILE_HEIGHT = 1200;
const TILE_SCALE = 0.1;

// Images
import CloudImage from "@/assets/Cloud.png";

export const Cloud: React.FC = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useTick(() => {
    setX((v) => {
      const newV = v + XSPEED;

      if (newV > TILE_WIDTH / TILE_SCALE) {
        return newV - TILE_WIDTH / TILE_SCALE;
      }

      return newV;
    });

    setY((v) => {
      const newV = v - YSPEED;

      if (newV < 0) {
        return newV + TILE_HEIGHT / TILE_SCALE;
      }

      return newV;
    });
  });

  return (
    <TilingSprite
      image={CloudImage}
      x={WindowGap}
      y={WindowGap}
      width={BlockSize * BlockXLength}
      height={BlockSize * BlockYLength}
      tilePosition={{ x: x, y: y }}
      tileScale={{ x: 0.5, y: 0.5 }}
      alpha={0.1}
    />
  );
};
