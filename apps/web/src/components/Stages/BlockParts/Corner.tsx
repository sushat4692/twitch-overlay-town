import React, { useMemo } from "react";
import { Sprite } from "@inlet/react-pixi";
import { useResidentValue } from "@/state/Resident";
import { BlockSize } from "@/const/Town";

// Images
import RoadCornerRT from "@/assets/Road-corner-rt.png";
import RoadCornerRB from "@/assets/Road-corner-rb.png";
import RoadCornerLT from "@/assets/Road-corner-lt.png";
import RoadCornerLB from "@/assets/Road-corner-lb.png";

type Props = {
  x: number;
  y: number;
  hasLeft: boolean;
  hasRight: boolean;
  hasTop: boolean;
  hasBottom: boolean;
};
export const BlockCorner: React.FC<Props> = ({
  x,
  y,
  hasLeft,
  hasRight,
  hasTop,
  hasBottom,
}) => {
  const residents = useResidentValue();

  const hasCornerRT = useMemo(() => {
    if (hasRight || hasTop) {
      return false;
    }

    return residents.some(
      (resident) =>
        resident.building_x - 1 === x &&
        resident.building_y + resident.building_height === y
    );
  }, [hasRight, hasTop, residents]);

  const hasCornerRB = useMemo(() => {
    if (hasRight || hasBottom) {
      return false;
    }

    return residents.some(
      (resident) =>
        resident.building_x - 1 === x && resident.building_y - 1 === y
    );
  }, [hasRight, hasBottom, residents]);

  const hasCornerLT = useMemo(() => {
    if (hasLeft || hasTop) {
      return false;
    }

    return residents.some(
      (resident) =>
        resident.building_x + resident.building_width === x &&
        resident.building_y + resident.building_height === y
    );
  }, [hasLeft, hasTop, residents]);

  const hasCornerLB = useMemo(() => {
    if (hasLeft || hasBottom) {
      return false;
    }

    return residents.some(
      (resident) =>
        resident.building_x + resident.building_width === x &&
        resident.building_y - 1 === y
    );
  }, [hasLeft, hasBottom, residents]);

  return (
    <>
      {hasCornerRT && (
        <Sprite
          image={RoadCornerRT}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
      {hasCornerRB && (
        <Sprite
          image={RoadCornerRB}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
      {hasCornerLT && (
        <Sprite
          image={RoadCornerLT}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
      {hasCornerLB && (
        <Sprite
          image={RoadCornerLB}
          x={0}
          y={0}
          width={BlockSize}
          height={BlockSize}
        />
      )}
    </>
  );
};
