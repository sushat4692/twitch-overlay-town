import React, { useCallback } from "react";
import { Button } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { useWindowState } from "../../state/Window";
import gsap from "gsap";
import { BlockSize, BlockXLength, BlockYLength } from "../../const/Town";
import { getThresholdX, getThresholdY } from "../../util/Stage";

const scaleDiff = 0.4;

export const Buttons: React.FC = () => {
  const [{ x, y, scale, width, height }, setWindow] = useWindowState();

  const animateScale = useCallback(
    (diff: number) => {
      const nextVal = (() => {
        if (scale + diff < 0.2) {
          return 0.2;
        } else if (scale + diff > 2) {
          return 2.2;
        } else {
          return Math.round((scale + diff) * 10) / 10;
        }
      })();

      const toX = (() => {
        const thresholdX = getThresholdX(nextVal, width);
        const nextX =
          x +
          (BlockSize * scale * BlockXLength -
            BlockSize * nextVal * BlockXLength) /
            2;

        if (thresholdX < 0) {
          if (nextX > 0) {
            return 0;
          } else if (nextX < thresholdX) {
            return thresholdX;
          }
        } else {
          if (nextX < 0) {
            return 0;
          } else if (nextX > thresholdX) {
            return thresholdX;
          }
        }

        return nextX;
      })();
      const toY = (() => {
        const thresholdY = getThresholdY(nextVal, height);
        const nextY =
          y +
          (BlockSize * scale * BlockYLength -
            BlockSize * nextVal * BlockYLength) /
            2;

        if (thresholdY < 0) {
          if (nextY > 0) {
            return 0;
          } else if (nextY < thresholdY) {
            return thresholdY;
          }
        } else {
          if (nextY < 0) {
            return 0;
          } else if (nextY > thresholdY) {
            return thresholdY;
          }
        }

        return nextY;
      })();

      gsap
        .to(
          { scale, x, y },
          {
            scale: nextVal,
            x: toX,
            y: toY,
            ease: "power2.out",
            onUpdate: function () {
              setWindow((prev) => ({
                ...prev,
                ...{
                  scale: this._targets[0].scale,
                  x: this._targets[0].x,
                  y: this._targets[0].y,
                },
              }));
            },
          }
        )
        .duration(0.3)
        .play();
    },
    [x, y, scale, width, height]
  );

  const handleClickZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    animateScale(scaleDiff);
  };
  const handleClickZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    animateScale(-scaleDiff);
  };

  return (
    <div className="absolute right-5 bottom-5 grid gap-2">
      <Button
        type="primary"
        shape="circle"
        icon={<ZoomInOutlined />}
        size="large"
        onClick={handleClickZoomIn}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<ZoomOutOutlined />}
        size="large"
        onClick={handleClickZoomOut}
      />
    </div>
  );
};
