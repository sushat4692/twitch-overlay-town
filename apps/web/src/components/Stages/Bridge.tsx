import React from "react";
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from "recoil";
import { Stage } from "@inlet/react-pixi";

type StageProps = React.ComponentProps<typeof Stage>;
export const BridgeStage: React.FC<StageProps> = ({ children, ...props }) => {
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  return (
    <Stage {...props}>
      <RecoilBridge>{children}</RecoilBridge>
    </Stage>
  );
};
