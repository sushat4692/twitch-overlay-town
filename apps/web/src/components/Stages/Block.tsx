import React from "react";
import { Container } from "@inlet/react-pixi";
import { WindowGap } from "@/const/Window";
import { BlockSize } from "@/const/Town";

// Components
import {
  BlockCorner,
  BlockInner,
  BlockRoad,
} from "@/components/Stages/BlockParts";
import { useBlockAction } from "@/components/Stages/Block.action";

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
      <BlockRoad
        hasLeft={hasLeft}
        hasRight={hasRight}
        hasTop={hasTop}
        hasBottom={hasBottom}
      />

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
