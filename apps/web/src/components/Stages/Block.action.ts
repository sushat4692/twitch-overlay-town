import { useMemo } from "react";
import { useResidentValue } from "@/state/Resident";

export const useBlockAction = (x: number, y: number) => {
  const residents = useResidentValue();

  const hasBuilding = useMemo(() => {
    return residents.some(
      (resident) =>
        resident.building_x > x - resident.building_width &&
        resident.building_x <= x &&
        resident.building_y > y - resident.building_height &&
        resident.building_y <= y
    );
  }, [x, y, residents]);

  const hasRight = useMemo(() => {
    if (hasBuilding) {
      return residents.some(
        (resident) =>
          resident.building_x + resident.building_width === x + 1 &&
          resident.building_y > y - resident.building_height &&
          resident.building_y <= y
      );
    }

    return residents.some(
      (resident) =>
        resident.building_x === x + 1 &&
        resident.building_y > y - resident.building_height &&
        resident.building_y <= y
    );
  }, [x, y, hasBuilding, residents]);

  const hasLeft = useMemo(() => {
    if (hasBuilding) {
      return residents.some(
        (resident) =>
          resident.building_x === x &&
          resident.building_y > y - resident.building_height &&
          resident.building_y <= y
      );
    }

    return residents.some(
      (resident) =>
        resident.building_x + resident.building_width === x &&
        resident.building_y > y - resident.building_height &&
        resident.building_y <= y
    );
  }, [x, y, hasBuilding, residents]);

  const hasBottom = useMemo(() => {
    if (hasBuilding) {
      return residents.some(
        (resident) =>
          resident.building_x > x - resident.building_width &&
          resident.building_x <= x &&
          resident.building_y + resident.building_height === y + 1
      );
    }

    return residents.some(
      (resident) =>
        resident.building_x > x - resident.building_width &&
        resident.building_x <= x &&
        resident.building_y - 1 === y
    );
  }, [x, y, hasBuilding, residents]);

  const hasTop = useMemo(() => {
    if (hasBuilding) {
      return residents.some(
        (resident) =>
          resident.building_x > x - resident.building_width &&
          resident.building_x <= x &&
          resident.building_y === y
      );
    }

    return residents.some(
      (resident) =>
        resident.building_x > x - resident.building_width &&
        resident.building_x <= x &&
        resident.building_y + resident.building_height === y
    );
  }, [x, y, hasBuilding, residents]);

  return { hasBuilding, hasRight, hasLeft, hasBottom, hasTop };
};
