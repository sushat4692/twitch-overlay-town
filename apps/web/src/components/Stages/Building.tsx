import React, { useCallback, useMemo } from "react";
import { Sprite } from "@inlet/react-pixi";
import { ResidentType } from "@/state/Resident";
import { WindowGap } from "@/const/Window";
import { BlockSize } from "@/const/Town";
import { useCurrentReset, useCurrentState } from "@/state/Current";
import Building1x1Image from "@/assets/Building1x1.png";
import Building2x2Image from "@/assets/Building2x2.png";
import Building3x3Image from "@/assets/Building3x3.png";

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

  const image = useMemo(() => {
    if (resident.building_width === 1 && resident.building_height === 1) {
      return Building1x1Image;
    }

    if (resident.building_width === 2 && resident.building_height === 2) {
      return Building2x2Image;
    }

    if (resident.building_width === 3 && resident.building_height === 3) {
      return Building3x3Image;
    }

    return undefined;
  }, [resident]);

  return image ? (
    <Sprite
      image={image}
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
  ) : null;
};
