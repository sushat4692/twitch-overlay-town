import React, { useCallback, useEffect, useRef } from "react";
import { DndContext, DragMoveEvent, DragEndEvent } from "@dnd-kit/core";
import gsap from "gsap";
import { useSocket } from "./contexts/Socket";
import { WindowGap } from "./const/Window";
import { BlockSize, BlockXLength, BlockYLength } from "./const/Town";
import { ResidentType, useResidentState } from "./state/Resident";
import { Draggable } from "./components/Draggable";
import { AppStage } from "./components/AppStage";
import { useWindowState } from "./state/Window";
import { AppInterface } from "./components/AppInterface";

function App() {
  const [{ x, y, scale, width, height }, setWindowValue] = useWindowState();
  const socket = useSocket();
  const prevX = useRef(0);
  const prevY = useRef(0);
  const [_, setResidents] = useResidentState();
  const inited = useRef(false);

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
      setResidents(
        residents.map((resident) => ({
          user_id: Number(resident.user_id),
          user_name: resident.user_name,
          user_display_name: resident.user_display_name,
          building_x: Number(resident.building_x),
          building_y: Number(resident.building_y),
          building_width: Number(resident.building_width),
          building_height: Number(resident.building_height),
          building_rank: Number(resident.building_rank),
        }))
      );
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
                return {
                  user_id: Number(resident.user_id),
                  user_name: resident.user_name,
                  user_display_name: resident.user_display_name,
                  building_x: Number(resident.building_x),
                  building_y: Number(resident.building_y),
                  building_width: Number(resident.building_width),
                  building_height: Number(resident.building_height),
                  building_rank: Number(resident.building_rank),
                };
              } else {
                return r;
              }
            });
          } else {
            return [
              ...prev,
              {
                user_id: Number(resident.user_id),
                user_name: resident.user_name,
                user_display_name: resident.user_display_name,
                building_x: Number(resident.building_x),
                building_y: Number(resident.building_y),
                building_width: Number(resident.building_width),
                building_height: Number(resident.building_height),
                building_rank: Number(resident.building_rank),
              },
            ];
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
      const thresholdX =
        -(BlockSize * scale * BlockXLength) - WindowGap * 2 + width;
      const thresholdY =
        -(BlockSize * scale * BlockYLength) - WindowGap * 2 + height;

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

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <Draggable>
        <AppStage />
      </Draggable>

      <AppInterface />
    </DndContext>
  );
}

export default App;
