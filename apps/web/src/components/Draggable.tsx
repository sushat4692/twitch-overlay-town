import React from "react";
import { useDraggable } from "@dnd-kit/core";

export const Draggable: React.FC = ({ children }) => {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: "draggable",
  });

  return (
    <div className="App" ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
};
