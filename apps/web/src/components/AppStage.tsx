import React from "react";
import { useWindowValue } from "../state/Window";
import { BridgeStage } from "./Stages/Bridge";
import { Grid } from "./Stages/Grid";
import { Resident } from "./Stages/Resident";
import { Container } from '@inlet/react-pixi'

export const AppStage: React.FC = () => {
  const { width, height, x, y } = useWindowValue();

  return (
    <BridgeStage
      width={width}
      height={height}
      options={{ backgroundAlpha: 0, antialias: false }}
    >
      <Container x={x} y={y}>
        <Grid />
        <Resident />
      </Container>
    </BridgeStage>
  );
};
