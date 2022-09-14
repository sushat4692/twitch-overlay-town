import React, { useMemo } from "react";
import { Container, Sprite } from "@inlet/react-pixi";
import { WindowGap } from "@/const/Window";
import { BlockSize } from "@/const/Town";
import { useResidentValue } from "@/state/Resident";

// Images
import RoadAll from "@/assets/Road-all.png";
import RoadRight from "@/assets/Road-right.png";
import RoadLeft from "@/assets/Road-left.png";
import RoadTop from "@/assets/Road-top.png";
import RoadBottom from "@/assets/Road-bottom.png";

// Components
import { BlockCorner } from "./Block/Corner";
import { BlockInner } from "./Block/Inner";
import { useBlockAction } from "./Block.action";

type Props = {
  x: number;
  y: number;
};
export const Block: React.FC<Props> = ({ x, y }) => {
  const { hasBuilding, hasRight, hasLeft, hasBottom, hasTop } = useBlockAction(
    x,
    y
  );

  return (
    <Container
      x={WindowGap + BlockSize * x}
      y={WindowGap + BlockSize * y}
      width={BlockSize}
      height={BlockSize}
    >
      {/* {hasBuilding && (
        <Sprite
          image={RoadAll}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )} */}
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

      <BlockInner
        hasLeft={hasLeft}
        hasRight={hasRight}
        hasTop={hasTop}
        hasBottom={hasBottom}
      />

      {!hasBuilding && (
        <>
          <BlockCorner
            x={x}
            y={y}
            hasLeft={hasLeft}
            hasRight={hasRight}
            hasTop={hasTop}
            hasBottom={hasBottom}
          />
        </>
      )}
    </Container>
  );
};
