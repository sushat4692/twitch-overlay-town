import {
  atom,
  useRecoilValue,
  useRecoilState,
  useResetRecoilState,
} from "recoil";
import { ResidentType } from "./Resident";

const CurrentContext = atom<ResidentType | null>({
  key: "current",
  default: null,
});

export const useCurrentValue = () => {
  return useRecoilValue(CurrentContext);
};

export const useCurrentState = () => {
  return useRecoilState(CurrentContext);
};

export const useCurrentReset = () => {
  return useResetRecoilState(CurrentContext);
};
