import React from "react";
import { useWindowValue } from "../state/Window";
import { BridgeStage } from "./Stages/Bridge";
import { Grid } from "./Stages/Grid";
import { Resident } from "./Stages/Resident";

export const AppStage: React.FC = () => {
  const { width, height } = useWindowValue();

  return (
    <BridgeStage
      width={width}
      height={height}
      options={{ backgroundAlpha: 0, antialias: false }}
    >
      <Grid />
      <Resident />
    </BridgeStage>
  );
};
