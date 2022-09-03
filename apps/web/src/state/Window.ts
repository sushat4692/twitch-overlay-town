import { atom, useRecoilValue, useRecoilState } from "recoil";

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
    x: 0,
    y: 0,
    scale: 1,
  },
});

export const useWindowValue = () => {
  return useRecoilValue(WindowContext);
};

export const useWindowState = () => {
  return useRecoilState(WindowContext);
};
