import React, { useCallback } from "react";
import { Sprite, Container } from "@inlet/react-pixi";
import { ResidentType } from "../../state/Resident";
import { WindowGap } from "../../const/Window";
import { BlockSize } from "../../const/Town";
import { useWindowValue } from "../../state/Window";
import { useCurrentReset, useCurrentState } from "../../state/Current";
import BuildingImage from "../../assets/Building01.png";

type Props = {
  resident: ResidentType;
};
export const Building: React.FC<Props> = ({ resident }) => {
  const { x, y, scale } = useWindowValue();
  const [_, setCurrent] = useCurrentState();
  const resetCurrent = useCurrentReset();

  const handleMouseOver = useCallback(() => {
    setCurrent(resident);
  }, [resident]);

  const handleClick = useCallback(() => {
    console.log(resident);
  }, [resident]);

  const handleMouseOut = useCallback(() => {
    resetCurrent();
  }, [resident]);

  return (
    <Container x={x} y={y}>
      <Sprite
        image={BuildingImage}
        x={WindowGap + BlockSize * scale * resident.building_x}
        y={WindowGap + BlockSize * scale * resident.building_y}
        width={BlockSize * scale * resident.building_width}
        height={BlockSize * scale * resident.building_height}
        interactive={true}
        click={handleClick}
        mouseover={handleMouseOver}
        mouseout={handleMouseOut}
        mouseupoutside={handleMouseOut}
      />
    </Container>
  );
};
