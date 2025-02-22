import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import Task from "./Task";

const TaskList = ({ category, tasks }) => {
  // Provide droppable data: type "container" with the category.
  const { setNodeRef } = useDroppable({ id: category, data: { type: "container", category } });
  const categoryTasks = tasks.filter((task) => task.category === category);

  return (
    // In TaskList.js
    <div
      ref={setNodeRef}
      className="p-4 border rounded-md bg-gray-100 min-h-[300px] shadow-inner flex flex-col"
    >
      <h2 className="text-xl font-semibold text-center mb-4">{category}</h2>
      <div className="flex-1">
        <SortableContext items={categoryTasks.map((task) => task._id)}>
          {categoryTasks.map((task) => (
            <Task key={task._id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default TaskList;
