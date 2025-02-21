import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import TaskList from "./TaskList"; // Task UI component

const Home = () => {
  const queryClient = useQueryClient();

  // Fetch tasks from backend
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/tasks"); // Replace with your API URL
      return res.data;
    },
  });

  // Handle reordering of tasks
  const mutation = useMutation({
    mutationFn: async (updatedTasks) => {
      await axios.put("http://localhost:5000/tasks/reorder", updatedTasks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Drag End Event Handler
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const newTasks = arrayMove(
      tasks,
      tasks.findIndex((task) => task.id === active.id),
      tasks.findIndex((task) => task.id === over.id)
    );

    mutation.mutate(newTasks);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center">Task Management</h1>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map((task) => task.id)}>
            <div className="grid grid-cols-3 gap-4">
              {["To-Do", "In Progress", "Done"].map((category) => (
                <TaskList key={category} category={category} tasks={tasks} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default Home;
