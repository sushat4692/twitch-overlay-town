import { BlockSize, BlockXLength, BlockYLength } from "@/const/Town";
import { WindowGap } from "@/const/Window";

export const getThresholdX = (scale: number, width: number) =>
  -(BlockSize * scale * BlockXLength) - WindowGap * scale * 2 + width;

export const getThresholdY = (scale: number, height: number) =>
  -(BlockSize * scale * BlockYLength) - WindowGap * scale * 2 + height;
