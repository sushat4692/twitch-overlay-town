import React, { useCallback } from "react";
import { Graphics } from "@inlet/react-pixi";
import PIXI from "pixi.js";
import { ResidentType } from "../../state/Resident";
import { WindowGap } from "../../const/Window";
import { BlockSize } from "../../const/Town";
import { useWindowValue } from "../../state/Window";
import { useCurrentReset, useCurrentState } from "../../state/Current";

type Props = {
  resident: ResidentType;
};
export const Building: React.FC<Props> = ({ resident }) => {
  const { x, y, scale } = useWindowValue();
  const [_, setCurrent] = useCurrentState();
  const resetCurrent = useCurrentReset();

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.lineStyle({ width: 2, color: 0xff0000 });
      g.beginFill(0xffeeee, 0.5);

      g.drawRect(
        WindowGap + BlockSize * scale * resident.building_x,
        WindowGap + BlockSize * scale * resident.building_y,
        BlockSize * scale * resident.building_width,
        BlockSize * scale * resident.building_height
      );
    },
    [resident, scale]
  );

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
    <Graphics
      x={x}
      y={y}
      draw={draw}
      interactive={true}
      click={handleClick}
      mouseover={handleMouseOver}
      mouseout={handleMouseOut}
      mouseupoutside={handleMouseOut}
    />
  );
};
