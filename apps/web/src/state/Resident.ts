import { atom, useRecoilValue, useRecoilState } from "recoil";

export type ResidentType = {
  user_id: number;
  user_name: string;
  user_display_name: string;
  building_x: number;
  building_y: number;
  building_width: number;
  building_height: number;
  building_rank: number;
};

const ResidentContext = atom<ResidentType[]>({
  key: "resident",
  default: [],
});

export const useResidentValue = () => {
  return useRecoilValue(ResidentContext);
};

export const useResidentState = () => {
  return useRecoilState(ResidentContext);
};
