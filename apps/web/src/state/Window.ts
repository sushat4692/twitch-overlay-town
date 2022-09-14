import { atom, useRecoilValue, useRecoilState } from "recoil";
import { WindowGap } from "@/const/Window";
import { BlockSize, BlockXLength, BlockYLength } from "@/const/Town";

type WindowContextType = {
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
};

const WindowContext = atom<WindowContextType>({
  key: "window",
  default: {
    width: window.innerWidth,
    height: window.innerHeight,
    x: -(BlockSize * BlockXLength + WindowGap * 2) / 2 + window.innerWidth / 2,
    y: -(BlockSize * BlockYLength + WindowGap * 2) / 2 + window.innerHeight / 2,
    scale: 1,
  },
});

export const useWindowValue = () => {
  return useRecoilValue(WindowContext);
};

export const useWindowState = () => {
  return useRecoilState(WindowContext);
};
