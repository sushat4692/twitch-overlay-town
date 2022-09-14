import React from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "@/components/Draggable";
import { AppStage } from "@/components/AppStage";
import { AppInterface } from "@/components/AppInterface";
import { Spin } from "antd";
import { useAction } from "@/App.action";

const App: React.FC = () => {
  const { loaded, handleDragStart, handleDragMove, handleDragEnd } =
    useAction();

  return (
    <Spin tip="Loading..." size="large" spinning={!loaded}>
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
    </Spin>
  );
};

export default App;
