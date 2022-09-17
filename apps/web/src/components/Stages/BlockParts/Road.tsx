import React from "react";
import { Sprite } from "@inlet/react-pixi";
import { BlockSize } from "@/const/Town";

// Images
import RoadRight from "@/assets/Road-right.png";
import RoadLeft from "@/assets/Road-left.png";
import RoadTop from "@/assets/Road-top.png";
import RoadBottom from "@/assets/Road-bottom.png";

type Props = {
  hasRight: boolean;
  hasLeft: boolean;
  hasBottom: boolean;
  hasTop: boolean;
};
export const BlockRoad: React.FC<Props> = ({
  hasRight,
  hasLeft,
  hasTop,
  hasBottom,
}) => {
  return (
    <>
      {hasRight && (
        <Sprite
          image={RoadRight}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
      {hasLeft && (
        <Sprite
          image={RoadLeft}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
      {hasBottom && (
        <Sprite
          image={RoadBottom}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
      {hasTop && (
        <Sprite
          image={RoadTop}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
    </>
  );
};
