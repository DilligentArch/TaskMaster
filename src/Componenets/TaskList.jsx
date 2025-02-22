import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import Task from "./Task";

const TaskList = ({ category, tasks }) => {
  const { setNodeRef } = useDroppable({ id: category });

  return (
    <div ref={setNodeRef} className="p-4 border rounded-md bg-gray-100 min-h-[300px]">
      <h2 className="text-xl font-semibold text-center">{category}</h2>
      <SortableContext items={tasks.map((task) => task._id)}>
        {tasks
          .filter((task) => task.category === category)
          .map((task) => (
            <Task key={task._id} task={task} />
          ))}
      </SortableContext>
    </div>
  );
};

export default TaskList;
