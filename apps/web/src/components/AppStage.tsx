import React, { useMemo } from "react";
import { useWindowValue } from "@/state/Window";
import { BridgeStage } from "@/components/Stages/Bridge";
import { Grid } from "@/components/Stages/Grid";
import { Block } from "@/components/Stages/Block";
import { Resident } from "@/components/Stages/Resident";
import { BlockXLength, BlockYLength } from "@/const/Town";
import { Container } from "@inlet/react-pixi";

export const AppStage: React.FC = () => {
  const { width, height, scale, x, y } = useWindowValue();

  const blocks = useMemo(() => {
    const results: { x: number; y: number }[] = [];

    for (let x = -1; x < BlockXLength + 1; x += 1) {
      for (let y = -1; y < BlockYLength + 1; y += 1) {
        results.push({ x, y });
      }
    }

    return results;
  }, []);

  return (
    <BridgeStage
      width={width}
      height={height}
      options={{ backgroundAlpha: 0, antialias: false }}
    >
      <Container x={x} y={y} scale={scale}>
        <Grid />

        {blocks.map((block) => (
          <Block key={`${block.x}_${block.y}`} x={block.x} y={block.y} />
        ))}

        <Resident />
      </Container>
    </BridgeStage>
  );
};
