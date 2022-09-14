import { useCallback, useEffect, useRef, useState } from "react";
import { DragMoveEvent, DragEndEvent } from "@dnd-kit/core";
import gsap from "gsap";
import { useSocket } from "@/contexts/Socket";
import { ResidentType, useResidentState } from "@/state/Resident";
import { useWindowState } from "@/state/Window";
import { getThresholdX, getThresholdY } from "@/util/Stage";

export const useAction = () => {
  const [{ x, y, scale, width, height }, setWindowValue] = useWindowState();
  const socket = useSocket();
  const prevX = useRef(0);
  const prevY = useRef(0);
  const [_, setResidents] = useResidentState();
  const inited = useRef(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (inited.current) {
      return;
    }
    inited.current = true;

    window.addEventListener("resize", () => {
      setWindowValue((prev) => ({
        ...prev,
        ...{ width: window.innerWidth, height: window.innerHeight },
      }));
    });

    socket.on("list", (residents: ResidentType[]) => {
      setResidents(residents);
      setLoaded(true);
    });
    setTimeout(() => {
      socket.emit("list");
    }, 1000);

    socket.on("building_updated", (resident: ResidentType) => {
      setResidents((prev) => {
        return (() => {
          if (prev.some((r) => r.user_id === resident.user_id)) {
            return prev.map((r) => {
              if (r.user_id === resident.user_id) {
                return resident;
              } else {
                return r;
              }
            });
          } else {
            return [...prev, resident];
          }
        })();
      });
    });
  }, []);

  const handleDragStart = () => {
    prevX.current = x || 0;
    prevY.current = y || 0;
  };

  const handleDragMove = (e: DragMoveEvent) => {
    setWindowValue((prev) => ({
      ...prev,
      ...{ x: prevX.current + e.delta.x, y: prevY.current + e.delta.y },
    }));
  };

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      const nextX = prevX.current + e.delta.x;
      const nextY = prevY.current + e.delta.y;
      const thresholdX = getThresholdX(scale, width);
      const thresholdY = getThresholdY(scale, height);

      const { toX, isXAnimate } = (() => {
        if (thresholdX < 0) {
          if (nextX > 0) {
            return { toX: 0, isXAnimate: true };
          } else if (nextX < thresholdX) {
            return { toX: thresholdX, isXAnimate: true };
          }
        } else {
          if (nextX < 0) {
            return { toX: 0, isXAnimate: true };
          } else if (nextX > thresholdX) {
            return { toX: thresholdX, isXAnimate: true };
          }
        }

        return { toX: nextX, isXAnimate: false };
      })();

      const { toY, isYAnimate } = (() => {
        if (thresholdY < 0) {
          if (nextY > 0) {
            return { toY: 0, isYAnimate: true };
          } else if (nextY < thresholdY) {
            return { toY: thresholdY, isYAnimate: true };
          }
        } else {
          if (nextY < 0) {
            return { toY: 0, isYAnimate: true };
          } else if (nextY > thresholdY) {
            return { toY: thresholdY, isYAnimate: true };
          }
        }

        return { toY: nextY, isYAnimate: false };
      })();

      if (isXAnimate || isYAnimate) {
        gsap
          .to(
            { x: nextX, y: nextY },
            {
              x: toX,
              y: toY,
              ease: "power2.out",
              onUpdate: function () {
                setWindowValue((prev) => ({
                  ...prev,
                  ...{
                    x: this._targets[0].x,
                    y: this._targets[0].y,
                  },
                }));
              },
            }
          )
          .duration(0.3)
          .play();
      } else {
        setWindowValue((prev) => ({
          ...prev,
          ...{ x: toX, y: toY },
        }));
      }
    },
    [scale, width, height]
  );

  return { loaded, handleDragStart, handleDragMove, handleDragEnd };
};
