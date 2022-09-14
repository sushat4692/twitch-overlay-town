import React, { useCallback } from "react";
import { Sprite } from "@inlet/react-pixi";
import { ResidentType } from "@/state/Resident";
import { WindowGap } from "@/const/Window";
import { BlockSize } from "@/const/Town";
import { useCurrentReset, useCurrentState } from "@/state/Current";
import Building01Image from "@/assets/Building01.png";
import Building02Image from "@/assets/Building02.png";

type Props = {
  resident: ResidentType;
};
export const Building: React.FC<Props> = ({ resident }) => {
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
    <Sprite
      image={resident.building_rank > 5 ? Building01Image : Building02Image}
      x={WindowGap + BlockSize * resident.building_x}
      y={WindowGap + BlockSize * resident.building_y}
      width={BlockSize * resident.building_width}
      height={BlockSize * resident.building_height}
      interactive={true}
      click={handleClick}
      mouseover={handleMouseOver}
      mouseout={handleMouseOut}
      mouseupoutside={handleMouseOut}
    />
  );
};
