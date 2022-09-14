import React from "react";
import { Sprite } from "@inlet/react-pixi";
import { BlockSize } from "@/const/Town";

// Images
import RoadInnerRT from "@/assets/Road-inner-rt.png";
import RoadInnerRB from "@/assets/Road-inner-rb.png";
import RoadInnerLT from "@/assets/Road-inner-lt.png";
import RoadInnerLB from "@/assets/Road-inner-lb.png";

type Props = {
  hasLeft: boolean;
  hasRight: boolean;
  hasTop: boolean;
  hasBottom: boolean;
};
export const BlockInner: React.FC<Props> = ({
  hasLeft,
  hasRight,
  hasTop,
  hasBottom,
}) => {
  return (
    <>
      {hasRight && hasTop && (
        <Sprite
          image={RoadInnerRT}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
      {hasRight && hasBottom && (
        <Sprite
          image={RoadInnerRB}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
      {hasLeft && hasTop && (
        <Sprite
          image={RoadInnerLT}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
      {hasLeft && hasBottom && (
        <Sprite
          image={RoadInnerLB}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
    </>
  );
};
