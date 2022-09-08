import React, { useMemo } from "react";
import { useWindowValue } from "../state/Window";
import { BridgeStage } from "./Stages/Bridge";
import { Grid } from "./Stages/Grid";
import { Block } from "./Stages/Block";
import { Resident } from "./Stages/Resident";
import { BlockWidth, BlockHeight, BlockXLength, BlockYLength } from '../const/Town'
import { Container } from '@inlet/react-pixi'

export const AppStage: React.FC = () => {
  const { width, height, scale, x, y } = useWindowValue();

  const blocks = useMemo(() => {
    const results: {x: number, y: number}[] = []

    for (let x = 0; x < BlockXLength; x += BlockWidth) {
      for (let y = 0; y < BlockYLength; y += BlockHeight) {
        results.push({x, y});
      }
    }

    return results;
  }, [])

  return (
    <BridgeStage
      width={width}
      height={height}
      options={{ backgroundAlpha: 0, antialias: false }}
    >
      <Container x={x} y={y} scale={scale}>
        <Grid />

        {blocks.map(block => (
          <Block key={`${block.x}_${block.y}`} x={block.x} y={block.y} />
        ))}

        <Resident />
      </Container>
    </BridgeStage>
  );
};
